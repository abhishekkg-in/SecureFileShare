import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import filelServices from './filelServices'
import fileServices from './filelServices'

const initialState = {
    uploadedFiles: [],
    file: null,
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: '',
    viewFileData : null,
    isFileViewError: false,
    isFileViewLoading: false,
    isFileViewSuccess: false,
    viewFileMessage: '',
    isFileShareError: false,
    isFileShareLoading: false,
    isFileShareSuccess: false,
    shareFileMessage: '',
}


// uploading file
export const uploadFile = createAsyncThunk(
    'file/upload',
    async (file, thunkAPI) => {
        try {
            return await fileServices.uploadFile(file)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

// get uploaded file
export const getUploadedFile = createAsyncThunk(
    'file/uploaded/all',
    async (userId, thunkAPI) => {
        try {
            return await fileServices.getUploadedFile(userId)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)


// view uploaded file
export const viewFile = createAsyncThunk(
    'file/view',
    async (fileId, thunkAPI) => {
        try {
            return await fileServices.viewUploadedFile(fileId)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)


// share file
export const shareFile = createAsyncThunk(
    'file/share',
    async (shareFileData, thunkAPI) => {
        try {
            return await fileServices.shareFile(shareFileData)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)



// ------------------------  File SLICE  ----------------------------------------------------------

export const fileSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
        .addCase(uploadFile.pending, (state) => {
            state.isLoading = true
        })
        .addCase(uploadFile.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.file = action.payload
        })
        .addCase(uploadFile.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        // view file --------------------------
        .addCase(viewFile.pending, (state) => {
            state.isFileViewLoading = true
        })
        .addCase(viewFile.fulfilled, (state, action) => {
            state.isFileViewLoading = false
            state.isFileViewSuccess = true
            state.shareFileMessage = action.payload.message
        })
        .addCase(viewFile.rejected, (state, action) => {
            state.isFileViewLoading = false
            state.isFileViewError = true
            state.viewFileMessage = action.payload
        })
        // share file --------------------------------
        .addCase(shareFile.pending, (state) => {
            state.isFileShareLoading= true
        })
        .addCase(shareFile.fulfilled, (state, action) => {
            state.isFileShareLoading = false
            state.isFileShareSuccess = true
        })
        .addCase(shareFile.rejected, (state, action) => {
            state.isFileShareLoading = false
            state.isFileShareError = true
            state.shareFileMessage = action.payload
        })
        .addCase(getUploadedFile.fulfilled, (state, action) => {
            state.uploadedFiles = action.payload.data
        })
    }
})

export const { reset } = fileSlice.actions
export default fileSlice.reducer