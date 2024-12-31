import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import './UserDetails.css'

const UserDetails = () => {
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)
  // console.log(user)

  useEffect(() => {
    if(!user){
      navigate('/')
    }
  }, [user])

  return (
    <div className='outter'>
      <div className='container '>
        <div className='container my-5' style={{maxWidth:"500px"}}>
          <div className='card shadow-lg '>
            <div className='card-header bg-dark text-white'>
              <h2 className='text-center'>User Profile</h2>
            </div>
            <div className='card-body bg-secondary text-light'>
              {user ? (
                <>
                  <div className='row mb-3'>
                    <label className='col-sm-5 fw-bold text-uppercase' style={{textAlign:"right"}}>Name:</label>
                    <div className='col-sm-7'>{user.name}</div>
                  </div>
                  <div className='row mb-3'>
                    <label className='col-sm-5 fw-bold text-uppercase' style={{textAlign:"right"}}>Email:</label>
                    <div className='col-sm-7'>{user.email}</div>
                  </div>
                  <div className='row mb-3'>
                    <label className='col-sm-5 fw-bold text-uppercase' style={{textAlign:"right"}}>Mobile:</label>
                    <div className='col-sm-7'>{user.mobile}</div>
                  </div>
                  <div className='row mb-3'>
                    <label className='col-sm-5 fw-bold text-uppercase' style={{textAlign:"right"}}>Role:</label>
                    <div className='col-sm-7'>{user.role}</div>
                  </div>
                </>
              ) : (
                <div className='text-center text-danger'>
                  <p>User not found</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* <h1>User Page</h1>
        {user ? (
          <>
            <p>
              Name: <b>{user.name}</b>
            </p>
            <p>
              Email: <b>{user.email}</b>
            </p>
            <p>
              Mobile: <b>{user.mobile}</b>
            </p>
            <p>
              Role: <b>{user.role}</b>
            </p>
          </>
        ) : (
          <p>User not found</p>
        )} */}
      </div>
    </div>
  )
}

export default UserDetails
