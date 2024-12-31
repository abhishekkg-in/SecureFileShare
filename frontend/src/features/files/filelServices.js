import axios from "axios";
const API_URL = "http://localhost:8000/files"


// upload file
const uploadFile = async (encryptedFile) => {
    const response = await axios.post(`${API_URL}/upload`, encryptedFile)
    return response.data
}

// Get ALl uploaded file for logged user
const getUploadedFile = async (userId) => {
    const response = await axios.get(`${API_URL}/uploaded/${userId}`)
    return response.data
}

// view file
const viewUploadedFile = async (fileId) => {
    const response = await axios.post(`${API_URL}/view/${fileId}`)
    return response.data
}


// share file
const shareFile = async (shareFileData) => {
    const response = await axios.post(`${API_URL}/share`, shareFileData)
    return response.data
}





const fileServices = {
    uploadFile,
    getUploadedFile,
    viewUploadedFile,
    shareFile,
} 

export default fileServices