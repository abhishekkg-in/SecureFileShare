import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Registration from './pages/Registration/Registration'
import UserDetails from './pages/UserDetails/UserDetails'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import './index.css'

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' exact element={<Home />} />
          <Route path='/login' exact element={<Login />} />
          <Route path='/register' exact element={<Registration />} />
          <Route path='/userdetails' exact element={<UserDetails />} />
        </Routes>
      </Router>
      <Footer/>
      <ToastContainer />
    </div>
  );
}

export default App;
