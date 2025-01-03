import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { login, reset, logout } from '../../features/auth/authSlice'
import { toast } from 'react-toastify'
import { jwtDecode } from 'jwt-decode'
import FileView from '../../components/FileView/FileView'
import Typewriter from "typewriter-effect";
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
      <h3 className=' text-center mt-3 mb-5' style={{fontWeight:"bolder", fontFamily:"cursive", fontSize:"40px"}}>Document Manager Dashboard</h3>
      <div className='dashboard mt-3 mb-5 text-center '>
      <Typewriter
                onInit={(typewriter) => {
                    typewriter
                        .typeString("Welcome to Document Manager Dashboard...")
                        .pauseFor(1000)
                        .deleteAll()
                        .typeString("Uploade Files...")
                        .pauseFor(500)
                        .deleteAll()
                        .typeString("View Files...")
                        .pauseFor(500)
                        .deleteAll()
                        .typeString("Download Files...")
                        .pauseFor(500)
                        .deleteAll()
                        .typeString("Share among multiple users...")
                        .pauseFor(500)
                        .deleteAll()
                        .start();
                }}
            />
      </div>
      <FileView />
    </div>
  ) 
    
}

export default Home
