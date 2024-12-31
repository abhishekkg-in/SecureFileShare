import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { register, reset } from '../../features/auth/authSlice'
import { toast } from 'react-toastify'
import Spinner from '../../components/Spinner/Spinner'
import './Registration.css'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [data, setData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    password2: '',
  })

  const { name, email, mobile, password, password2 } = data
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(`Registration Failed, ${message}`)
    }

    if (isSuccess) {
      toast.success('Registration Succesfull')
      navigate('/login')
      // const id = localStorage.getItem('id')
      // if (id) {
      //   navigate(`hotels/${id}`)
      // } else {
      //   navigate('/')
      // }
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (password !== password2) {
      toast.error('Password do not match')
    } else {
      const userData = {
        name,
        email,
        mobile,
        password,
      }
      dispatch(register(userData))
      if(isError){
        toast.success('Registration Failed, ', message)
        // navigate('/userdetails')
      }
      if(isSuccess){
        toast.success('Registration Succesfull')
        navigate('/')
      }
    }
  }

  // if(isError){
  //   toast.error('Registration Failed, ', message)
  // }

  // if(isSuccess){
  //   toast.success('Registration Succesfull')
  //   navigate('/')
  // }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className='home-outter outter'>
      <div className=' container text-center '>
        <h1>Registration</h1>
        <div>
          <form className='form' onSubmit={handleSubmit}>
            <input
              type='text'
              value={name}
              onChange={handleChange}
              placeholder='name'
              id='name'
              name='name'
              required
            />
            <input
              type='email'
              value={email}
              onChange={handleChange}
              placeholder='email'
              name='email'
              required
            />
            <input
              type='text'
              value={mobile}
              onChange={handleChange}
              placeholder='mobile'
              name='mobile'
              required
            />
            <input
              type='password'
              value={password}
              onChange={handleChange}
              placeholder='password'
              name='password'
              required
            />
            <input
              type='password'
              value={password2}
              onChange={handleChange}
              placeholder='confirm password'
              name='password2'
              required
            />

            <button type='submit'>Submit</button>
          </form>
          <div className='reg-link'>
            <span>Already registered ?</span>
            <Link to='/login'>Signin now</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
