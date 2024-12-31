import axios from "axios";
const API_URL = "http://localhost:8000/users"


// user registration
const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData)

    if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data.data))
    }
    return response.data
}


// user login
const login = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData)
    
    if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data.data))
    }
    return response.data
}

// user logout
const logout =  () => {
    localStorage.removeItem('user')
}

// get all users data for file share
const getUsers = async () => {
    const response = await axios.get(`${API_URL}/all`)
    return response.data
}



const authServices = {
    register,
    login,
    logout,
    getUsers
}

export default authServices