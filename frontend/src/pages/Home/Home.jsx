import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { login, reset, logout } from '../../features/auth/authSlice'
import { toast } from 'react-toastify'
import { jwtDecode } from 'jwt-decode'
import FileView from '../../components/FileView/FileView'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  if(!user){
    navigate('/login')
  }


  return (
    <div className='container'>
      <h3 className='text-center mt-3 mb-5'>Document Manager Dashboard</h3>
      <FileView />
    </div>
  ) 
    
}

export default Home
