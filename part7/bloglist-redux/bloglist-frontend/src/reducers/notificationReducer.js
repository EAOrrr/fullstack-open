import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        successMessage: null,
        errorMessage: null
    },
    reducers: {
        setSuccesssMessage(state, action) {
            return {
                successMessage: action.payload,
                errorMessage: null
            }
        },
        setErrorMessage(state, action) {
            return {
                successMessage: null,
                errorMessage: action.payload
            }
        },
        clearMessage(state) {
            return {
                successMessage: null,
                errorMessage: null
            }
        }
    }
})

export const createSuccessMessage = (message, time) => {
    return dispatch => {
        dispatch(setSuccesssMessage(message))
        setTimeout(() => {
            dispatch(clearMessage())
        }, time)
    }
}

export const createErrorMessage = (message, time) => {
    return dispatch => {
        dispatch(setErrorMessage(message))
        setTimeout(() => {
            dispatch(clearMessage())
        }, time)
    }
}

export const { setSuccesssMessage, setErrorMessage, clearMessage } = notificationSlice.actions
export default notificationSlice.reducer