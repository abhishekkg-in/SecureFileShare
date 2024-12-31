import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { MdCancel } from 'react-icons/md'
import { toast } from 'react-toastify'
import CryptoJS from 'crypto-js'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  uploadFile,
  reset,
  getUploadedFile,
  viewFile
} from '../../features/files/fileSlice'
import { FaFileUpload, FaDownload, FaEye, FaShareSquare, FaFileAlt } from 'react-icons/fa'
import Spinner from '../Spinner/Spinner'
import FilePreview from './FilePreview'
import ShareFileView from './ShareFileView'

const FileUpload = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { file, uploadedFiles, isLoading, isError, isSuccess, message, viewFileData, isFileShareError,isFileShareLoading, isFileShareSuccess, shareFileMessage } =
    useSelector((state) => state.file)

  const { user } = useSelector((state) => state.auth)

  const [uploadedFile, setUploadedFile] = useState([])

  const [files, setFiles] = useState([])

  const encryptFile = async (file) => {
    const fileData = await file.arrayBuffer()
    const wordArray = CryptoJS.lib.WordArray.create(fileData)
    const iv = CryptoJS.enc.Utf8.parse('1234567890123456') // 16 bytes
    const key = CryptoJS.enc.Utf8.parse('6v9X$2bF+P3@q!Wz') // Ensure 16 bytes

    const encryptedData = CryptoJS.AES.encrypt(wordArray, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC, // Match backend mode
      padding: CryptoJS.pad.Pkcs7,
    }).toString()

    const encryptedBlob = new Blob([encryptedData], { type: file.type })
    return encryptedBlob
  }

  const handleCancelFileUpload = (index) => {
    toast.success(`File: ${files[index].name} removed.`)
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const handleFileupload = async (file, index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
    // setUploadedFile((prevUploadedFile) => [...prevUploadedFile, file])
    console.log('file --> ', file)
    const bloabData = await encryptFile(file)
    console.log('Encrypted File -->> ', bloabData)
    const formData = new FormData()
    formData.append('file', bloabData, file.name)

    const fileName = file.name
    const lastDotIndex = fileName.lastIndexOf('.')
    const metaData = {
      title: lastDotIndex !== -1 ? fileName.slice(0, lastDotIndex) : fileName,
      extension: lastDotIndex !== -1 ? fileName.slice(lastDotIndex + 1) : '',
      fileSize: file.size,
      type: file.type,
      updatedBy: user !== null ? user.id : 1,
    }
    formData.append('metaData', JSON.stringify(metaData))
    dispatch(uploadFile(formData))
  }

  useEffect(() => {
    if(isFileShareError){
        toast.error(shareFileMessage)
    }else if(isFileShareSuccess){
        toast.success("File shared successfully.")
        setShareFile(false)
    }

  }, [dispatch, isFileShareError, isFileShareSuccess])

  const handleTableFileAction = () => {}

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*,application/pdf', // Accept specific file types
    multiple: true, // Allow multiple file uploads
  })

  //   dispatch(getUploadedFile(user !== null ? user.id : 1))

  useEffect(() => {
    dispatch(getUploadedFile(user !== null ? user.id : 1))
  }, [dispatch])

  useEffect(() => {
    if (isSuccess) {
      dispatch(getUploadedFile(user !== null ? user.id : 1))
      toast.success("File uploaded.")
    } else if (isError) {
      toast.error(`${message}`)
    }

    return () => {
      dispatch(reset()); 
    };


  }, [file, dispatch, isError, isSuccess, message])

  const formatedDate = (apiDate) => {
    const date = new Date(apiDate)
    const options = {
      year: 'numeric',
      month: 'short', // e.g., December
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      // timeZoneName: 'short', // e.g., UTC
    }
    const newDate = new Intl.DateTimeFormat('en-US', options).format(date)
    return newDate
  }


  const [showFile, setShowFile] = useState(false)
  const [shareFile, setShareFile] = useState(false)

  const [selectedFilePreview, setSelectedFilePreview] = useState({})

  const handleFileView = (file) => {
    setSelectedFilePreview(file)
    setShowFile(true)
  }

  const handleShareFile = (file) => {
    setSelectedFilePreview(file)
    setShareFile(true)
  }

  const downloadFile = (file) => {
    const fileUrl = `http://localhost:8000/files/view/${file.file_id}`;

    // Trigger download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `${file.title}.${file.extension}`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

  if (isLoading) {
    return <Spinner />
  }

  if(!user){
    navigate('/login')
  }

  return (
    <>
      {/* file upload drag & drop */}
      <div
        className='container mt-4 mb-3 shadow'
        {...getRootProps()}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          width: '80%',
          backgroundColor: isDragActive ? '#f0f0f0' : '#adb5bd',
        }}
      >
        <input className='shadow-sm' {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <p className=' text-secondary'>
            Drag & drop some files here, or click to select files
          </p>
        )}
      </div>

      {/* selected file view */}
      <div className='selected-file-view container'>
        <ul
          className='list-group container'
          style={{
            maxWidth: '700px',
            // width:"80%"
            // display: "flex",
            // justifyContent:"center",
            // alignItems:"center"
          }}
        >
          {files.map((file, index) => (
            <li
              key={index}
              className='list-group-item d-flex justify-content-between align-items-center shadow container'
              style={{
                backgroundColor: '#c8c8fa', // Light background
                borderRadius: '5px',
                marginBottom: '10px', // Border to separate items
              }}
            >
              <span style={{ fontWeight: '500', color: '#495057' }}>
                {file.name}
              </span>
              <div className='actions'>
                <FaFileUpload
                  title='Upload'
                  style={{
                    marginLeft: '10px',
                    marginRight: '5px',
                    cursor: 'pointer',
                    color: '#333', // Red color for cancel icon
                    fontSize: '1.5rem',
                  }}
                  onClick={() => handleFileupload(file, index)} // Ensure correct function call
                />
                <MdCancel
                  title='Cancel Upload'
                  style={{
                    marginLeft: '5px',
                    cursor: 'pointer',
                    color: '#333', // Red color for cancel icon
                    fontSize: '1.5rem',
                  }}
                  onClick={() => handleCancelFileUpload(index)} // Ensure correct function call
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* tble view of uploaded files */}
      <div className='uploaded-file-table-view'>
        <div className=' mt-4'>
          {/* <h2>Uploaded Files</h2> */}
          <table className='table table-sm table-borderless table-hover table-secondary table-striped '>
            <thead className='thead-dark'>
              <tr>
                <th>#</th>
                <th>File Name</th>
                <th>File Type</th>
                <th>Size</th>
                <th>Owner</th>
                <th>Uploaded At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.length > 0 ? (
                uploadedFiles.map((file, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td title={file.title} style={{ maxWidth: '8rem' }}>
                      <FaFileAlt/> {file.title}
                    </td>
                    <td>{file.type}</td>
                    <td>{(file.size / 1024).toFixed(2)} KB</td>
                    <td>
                      {
                        user && file.updated_by === user.id ? (
                          <>
                          You
                          </>
                        ) : (
                          <>
                          {file.user_name}
                          </>
                        )
                      }
                    </td>
                    <td>{formatedDate(file.updated_at)}</td>
                    <td>
                      {
                        user && (user.role == 'admin' || user.role=="regular") ? (
                          <>
                          {
                            file.shared == true ? (
                              <>
                              {
                                file.can_download && (
                                  <FaDownload
                            title='download'
                            onClick={() => downloadFile(file)}
                            style={{ margin: '0px 5px', cursor: 'pointer' }}
                          />
                                )
                              }
                              {
                                file.can_view && (
                                  <FaEye
                            onClick={() => handleFileView(file)}
                            title='view'
                            style={{ margin: '0px 5px', cursor: 'pointer' }}
                          />
                                )
                              }
                              </>

                            ) : (
                              <>
                              <FaDownload
                            title='download'
                            onClick={() => downloadFile(file)}
                            style={{ margin: '0px 5px', cursor: 'pointer' }}
                          />
                          <FaEye
                            onClick={() => handleFileView(file)}
                            title='view'
                            style={{ margin: '0px 5px', cursor: 'pointer' }}
                          />
                          <FaShareSquare
                            title='share'
                            style={{ margin: '0px 5px', cursor: 'pointer' }}
                            onClick={() =>
                              handleShareFile(file)
                            }
                            />
                              </>
                              
                            )
                          }
                          </>
                        ) : 
                        (
                          <>
                          <FaEye
                            onClick={() => handleFileView(file)}
                            title='view'
                            style={{ margin: '0px 5px', cursor: 'pointer' }}
                          />
                          </>
                        )
                      }
                      
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='6' className='text-center'>
                    No files uploaded yet, please upload your first file.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>




      {/* dialog for file preview */}

      {showFile && (
        <div className="modal show d-flex justify-content-center align-items-center" 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', height: '100vh' }}
        tabIndex="-1" 
        role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content" style={{
              minWidth: '40vw',
              maxHeight:"90vh",
              overflowY:"scroll"
            }}>
              <div className="modal-header">
                <h5 className="modal-title">{'Preview: ' + selectedFilePreview.title + '.' + selectedFilePreview.extension}</h5>
                <MdCancel 
                style={{
                  position:"absolute",
                  right:"1rem",
                  fontSize:"1.7rem"
                }}
                onClick={() => setShowFile(false)}
                />
                
              </div>
              <div className="modal-body">
                <FilePreview selectedFilePreview={selectedFilePreview} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowFile(false)} >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



{shareFile && (
        <div className="modal show d-flex justify-content-center align-items-center" 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', height: '100vh', width: '100vw' }}
        tabIndex="-1" 
        role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content" style={{
              minWidth: '70vw',
              minHeight: "80vh",
              display:"flex",
              marginLeft:"-16vw",
              maxHeight:"90vh",
              overflowY:"scroll"
            }}>
              <div className="modal-header">
                <h5 className="modal-title">{'Share: ' + selectedFilePreview.title + '.' + selectedFilePreview.extension}</h5>
                <MdCancel 
                style={{
                  position:"absolute",
                  right:"1rem",
                  fontSize:"1.7rem"
                }}
                onClick={() => setShareFile(false)}
                />
                
              </div>
              <div className="modal-body">
                <ShareFileView file={selectedFilePreview} />
              </div>
              {/* <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShareFile(false)} >
                  Close
                </button>
              </div> */}
            </div>
          </div>
        </div>
      )}


      



    </>
  )
}

export default FileUpload
