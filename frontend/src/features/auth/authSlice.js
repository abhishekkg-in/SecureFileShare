import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import authServices from './authServices'

// getting userData from local storage
const user = localStorage.getItem('user')

const initialState = {
    user: user ? JSON.parse(user) : null,
    users: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: '',

}

// Registering user
export const register = createAsyncThunk(
    'auth/register', 
    async (userData, thunkAPI) => {
        try {
            return await authServices.register(userData)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

// logiing user
export const login = createAsyncThunk(
    'auth/login',
    async (userData, thunkAPI) => {
        try {
            return await authServices.login(userData)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)


// get users data user
export const getUsers = createAsyncThunk(
    'auth/getusers',
    async (thunkAPI) => {
        try {
            return await authServices.getUsers()
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)


// loggingout user
export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        await authServices.logout()
    }
)

//----------------------- AUTH SLICE --------------------------------------------

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = false
            state.message = ""
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(register.pending, (state) => {
            state.isLoading = true
        })
        .addCase(register.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
        })
        .addCase(register.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
        })
        .addCase(login.pending, (state) => {
            state.isLoading = true
        })
        .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.message = action.payload.message
            state.user = action.payload.data
        })
        .addCase(login.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
        })
        .addCase(logout.fulfilled, (state) => {
            state.user = null
        })
        .addCase(getUsers.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getUsers.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.users = action.payload.data
        })
        .addCase(getUsers.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.users = []
        })
    }
})

export const {reset} = authSlice.actions
export default authSlice.reducer

