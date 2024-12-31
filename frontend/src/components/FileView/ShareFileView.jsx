import React, { useState, useEffect, useCallback } from 'react'
import { MdSearch, MdCancel } from 'react-icons/md'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
    shareFile,
    reset,
  } from '../../features/files/fileSlice'
import {
    getUsers
} from '../../features/auth/authSlice'
import Spinner from '../Spinner/Spinner'



const ShareFileView = ({ file }) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { isFileShareError,isFileShareLoading, isFileShareSuccess, shareFileMessage } =
    useSelector((state) => state.file)

    const { users, user } = useSelector((state) => state.auth)

    const [searchTerm, setSearchTerm] = useState('')
    const [searchUsers, setSearchUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])

    // const users = [
    //     {
    //         user_id: 1,
    //         name: "abhishek"
    //     },
    //     {
    //         user_id: 2,
    //         name: "Dipak"
    //     },
    //     {
    //         user_id: 3,
    //         name: "Umesh"
    //     },
    //     {
    //         user_id: 4,
    //         name: "Araj"
    //     },
    //     {
    //         user_id: 5,
    //         name: "Rishabh"
    //     },
    // ]

    useEffect(() => {
        dispatch(getUsers())
        console.log("users --->> ", users);
        
    }, [])

    useEffect(() => {
        if(searchTerm.length>0){
            const filteredUsers = users.filter((user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase())
              ).slice(0,3);
              setSearchUsers(filteredUsers);
        }else{
            setSearchUsers([])
        }
      }, [searchTerm]);

  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSelectUser = (user) => {
    setSelectedUsers((prevState) => [...prevState, user])
    setSearchUsers((prevSearchdUsers) =>
        prevSearchdUsers.filter((searchdUser) => searchdUser.user_id !== user.user_id)
      );
    setSearchTerm('')
  }

  const removeSelectedUser = (user) => {
    setSelectedUsers((prevSelectedUsers) =>
        prevSelectedUsers.filter((selectedUser) => selectedUser.user_id !== user.user_id)
      );
  }

  const [permissions, setPermissions] = useState({
    can_view: false,
    can_download: false,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [name]: checked,
    }));
  };

  const handleShare = () => {
    const formData = new FormData()
    const shareFileData = {
        file_id: file.file_id,
        shared_by: user !== null ? user.id : 1,
        shared_to: selectedUsers,
        can_view: permissions.can_view,
        can_download: permissions.can_download
    }
    formData.append('shareFileData', JSON.stringify(shareFileData))
    console.log("Share file data -->> ", shareFileData);
    
    dispatch(shareFile(formData))
  }

//   useEffect(() => {
//     if(isFileShareError){
//         toast.error(shareFileMessage)
//     }else if(isFileShareSuccess){
//         toast.success(shareFileMessage)
        
//     }

//   }, [dispatch, isFileShareError, isFileShareSuccess])

  if(isFileShareLoading){
    return <Spinner />
  }

  return (
    <div>

<div className='row justify-content-center'>
          <div className='col-md-8'>
            <div className='input-group rounded-pill border border-secondary'>
              <div className='input-group-text bg-transparent border-0'>
                <MdSearch className='' />
              </div>
              <input
                type='text'
                className='form-control border-0  bg-transparent rounded-pill no-focus '
                placeholder='Search users...'
                aria-label='Search'
                aria-describedby='basic-addon1'
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ maxWidth: '700px', width: '80%' }}
                tabIndex={-1}
              ></input>
            </div>
          </div>
        </div>


        <div className='selected-file-view container'>
        <ul
          className='list-group container mt-2'
          style={{
            maxWidth: '700px',
          }}
        >
          {searchUsers.map((user, index) => (
            <li
              key={index}
              className='list-group-item  d-flex justify-content-between align-items-center shadow container'
              style={{
                backgroundColor: '#c8c8fa', // Light background
                borderRadius: '5px',
                marginBottom: '3px', // Border to separate items
                width:"60%",
                cursor:"pointer",
              }}
              onClick={() => handleSelectUser(user)}
            >
              <span style={{ fontWeight: '500', color: '#495057' }}>
                {user.name}
              </span>
              <div className='actions'>
                {/* <MdCancel
                  title='Cancel Upload'
                  style={{
                    marginLeft: '5px',
                    cursor: 'pointer',
                    color: '#333', // Red color for cancel icon
                    fontSize: '1.5rem',
                  }}
                  onClick={() => handleCancelSelectedUser(index)} // Ensure correct function call
                /> */}
              </div>
            </li>
          ))}
        </ul>
      </div>


      <div>
      {
        selectedUsers.length==0 && searchUsers.length==0 ?
        (<p className="text-center container mt-2">Please select a user, start searching...</p>)
        : (<></>)
      }
      </div>




      <div className="mt-2 container">
  {selectedUsers.length > 0 ? (
    <>
      <h3>Selected Users</h3>
      <div className="container">
        {selectedUsers.map((user) => (
          <span
            key={user.user_id}
            className="badge bg-secondary me-2 "
            style={{ fontSize: '1rem' }}

          >
            {user.name}
            <MdCancel style={{marginLeft:"5px", fontSize:"1rem", cursor:"pointer"}} onClick={() => removeSelectedUser(user)} />
          </span>
        ))}
      </div>
    </>
  ) : (
    <></>
  )}
</div>






    {
        selectedUsers.length > 0 ? (
            <div className="container mt-5">
      <h3>Permission</h3>
      <form style={{marginLeft:"50px"}}>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="can_view"
            name="can_view"
            checked={permissions.can_view}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="can_view">
            Can View
          </label>
        </div>
        <div className="form-check container" >
          <input
            className="form-check-input"
            type="checkbox"
            id="can_download"
            name="can_download"
            checked={permissions.can_download}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="can_download">
            Can Download
          </label>
        </div>
      </form>


      <div className="mt-5" style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
    <button 
      className="btn btn-secondary" 
      onClick={handleShare}
      title="Share"
    >
      Share
    </button>
    </div>



    </div>
        ) : (<></>)
    }



    





    </div>
  )
}

export default ShareFileView