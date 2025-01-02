import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  login,
  reset,
  logout,
  googleLogin,
} from '../../features/auth/authSlice'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { toast } from 'react-toastify'
import { jwtDecode } from 'jwt-decode'
import './Login.css'
import Spinner from '../../components/Spinner/Spinner'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  const [data, setData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = data
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if(isSuccess){
      toast.success("Successfully login.")
    }else if (isError) {
      toast.error(message)
    }

    if (user) {
      navigate('/')
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const userData = {
      email,
      password,
    }
    dispatch(login(userData))
  }

  // Google login
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const handleLoginSuccess = (credentialResponse) => {
    console.log('Google Login Success:', credentialResponse)
    dispatch( googleLogin({credential: credentialResponse.credential}) )
  }

  const handleLoginFailure = () => {
    toast.error('Google Login Failed')
  }


  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className='home-outter outter'>
      <div className='container text-center'>
        <h1>Login</h1>
        <div>
          <form className='form' onSubmit={handleSubmit}>
            <input
              type='email'
              value={email}
              onChange={handleChange}
              placeholder='email'
              name='email'
              id='email'
              required
            />
            <input
              type='password'
              value={password}
              onChange={handleChange}
              placeholder='password'
              name='password'
              id='password'
              required
            />
            <button type='submit'>Submit</button>
          </form>
          <GoogleOAuthProvider clientId={clientId}>
            <div className='mt-3' style={{width:"max-content", margin:"0 auto"}}>
                <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginFailure}
                />
            </div>
        </GoogleOAuthProvider>
          <div className='reg-link'>
            <span>new user ?</span>
            <Link to='/register'>Register now</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
