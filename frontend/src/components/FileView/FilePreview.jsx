import React, { useEffect, useState } from 'react'
// import { Document, Page, pdfjs } from 'react-pdf'
import { FaRegSadTear } from 'react-icons/fa'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
// import {PDF} from 'react-pdf-scroll'
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
// pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

const FilePreview = ({ selectedFilePreview }) => {
  console.log('selected file in preview -->> ', selectedFilePreview)
  const [pdfData, setPdfData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/files/view/${selectedFilePreview.file_id}`
        ) // Replace with your API endpoint

        // var len = response.length;
        // var bytes = new Uint8Array( len );
        // for (var i = 0; i < len; i++){
        //     bytes[i] = response.charCodeAt(i);
        // }

        // const renderPdf = bytes.buffer

        // setPdfData(renderPdf)

        // const blob = await response.blob()
        // const arrayBuffer = await blob.arrayBuffer()
        // const pdfBytes = new Uint8Array(arrayBuffer)
        // const renderPdf = pdfBytes.buffer
        // setPdfData(renderPdf)
        // const pdfString = await response.text() // Assuming the API returns a string
        // const pdfBytesArray = new TextEncoder().encode(pdfString)
        // setPdfData(pdfBytesArray)
        //     const blob = await response.blob();
        // const arrayBuffer = await blob.arrayBuffer();
        // const pdfBytes = new Uint8Array(arrayBuffer);
        // setPdfData(pdfBytes)
        const blob = await response.blob()
        const objectURL = URL.createObjectURL(blob)
        console.log('--->> ', objectURL)
        setPdfData(objectURL)
        // console.log('====================================');
        // console.log("req -->> ", response.data);
        // console.log('====================================');
        // const pdfString = await response.text();
        // const pdfBytes = new Uint8Array(new TextEncoder().encode(pdfString));
        // setPdfData(pdfBytes);
        // console.log('====================================')
        // console.log('pdf -->> ', pdfBytes)
        // console.log('====================================')
      } catch (error) {
        console.error('Error fetching PDF:', error)
      }
    }

    fetchData()
  }, [])

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      padding: 30,
    },
    title: {
      fontSize: 24,
      textAlign: 'center',
    },
  })

  const renderFilePreview = () => {
    if (selectedFilePreview.type.startsWith('application/pdf')) {
      console.log('got pdf view ...')

      return (
        <div>
          {/* <PDF file={pdfData} scale={1.3} pages={Infinity} /> */}

          {/* <iframe
            src={`http://localhost:8000/files/view/${selectedFilePreview.file_id}`}
            title='PDF Preview'
            width='100%'
            height='600px'
            style={{ border: 'none' }}
          /> */}
          {/* <Document
                        file={`http://localhost:8000/files/view/${selectedFilePreview.file_id}`}
                        onLoadError={(error) => console.error('Error loading PDF:', error)}
                    >
                        <Page pageNumber={1} />
                    </Document> */}
          {pdfData && (
            <Document
              file={{
                url: `http://localhost:8000/files/view/${selectedFilePreview.file_id}`,
              }}
            >
              <Page>
                <View style={styles.container}>
                  <div className='text-center'>
                    <p>File type not supported for preview.</p>
                    <FaRegSadTear style={{ fontSize: '1.8rem' }} />
                  </div>
                  {/* <Text style={styles.title}>{selectedFilePreview.title}</Text> */}
                </View>
              </Page>
            </Document>
          )}

          {/* <object
            data={`http://localhost:8000/files/view/${selectedFilePreview.file_id}`}
            type='application/pdf'
            width='100%'
            height='100%'
          >
            <p>
              Alternative text - include a link{' '}
            </p>
          </object> */}
        </div>
      )
    } else if (selectedFilePreview.type.startsWith('image')) {
      return (
        <img
          src={`http://localhost:8000/files/view/${selectedFilePreview.file_id}`}
          alt='Preview'
          style={{  objectFit: 'contain', // Ensures the image fits in the container without distorting
            maxWidth: '100%',      // Ensures the image does not exceed the container's width
            maxHeight: '100%', }}
        />
      )
    } else {
      return (
        <div className='text-center'>
          <p>File type not supported for preview.</p>
          <FaRegSadTear style={{ fontSize: '1.8rem' }} />
        </div>
      )
    }
  }

  return <div>{renderFilePreview()}</div>
}

export default FilePreview
