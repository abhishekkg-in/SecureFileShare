import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { MdSearch } from 'react-icons/md'
import FileUpload from './FileUpload'
import './fileview.css'

const FileView = () => {
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState('')

  const { user } = useSelector(
      (state) => state.auth
    )

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  if(!user){
    navigate("/login")
  }

  return (
    <div>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-md-8'>
            <div className='input-group rounded-pill border border-secondary'>
              <div className='input-group-text bg-transparent border-0'>
                <MdSearch className='' />
              </div>
              <input
                type='text'
                className='form-control border-0  bg-transparent rounded-pill no-focus '
                placeholder='Search files...'
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



        <FileUpload />


      </div>
    </div>
  )
}

export default FileView
