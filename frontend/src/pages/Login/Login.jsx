import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { login, reset, logout } from '../../features/auth/authSlice'
import { toast } from 'react-toastify'
import { jwtDecode } from 'jwt-decode'
import './Login.css'
import Spinner from '../../components/Spinner/Spinner'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [data, setData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = data
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    // if (isSuccess) {
    //   toast.success(`${message}`)
    //   const token = user.token

    //   if (token) {
    //     const decodedToken = jwtDecode(token)
    //     const expiryTime = decodedToken.exp * 1000
    //     const timeUntilExpiry = expiryTime - Date.now()

    //     console.log("Token -->> ", token);
    //     console.log('====================================');
    //     console.log("Expiry time -->> ", expiryTime);
    //     console.log('====================================');
        

    //     if (timeUntilExpiry > 0) {
    //       const timeout = setTimeout(() => {
    //         toast.info('Session expired. Please log in again.')
    //         dispatch(logout())
    //         dispatch(reset())
    //         navigate('/')
    //         }, timeUntilExpiry)

    //       return () => clearTimeout(timeout)
    //     } else {
    //       toast.info('Session expired. Please log in again.')
    //       dispatch(logout())
    //       dispatch(reset())
    //       navigate('/')
    //     }
    //   }

      // settimeout
    // }

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
