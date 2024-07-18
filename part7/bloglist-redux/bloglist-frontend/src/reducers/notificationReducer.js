import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        message: null,
        type: null
    },
    reducers: {
        setNotification(state, action) {
            return action.payload
        },
        clearNotification(state, action) {
            return {
                message: null,
                type: null
            }
        }
    }
})

export const createNotification = (message, type = 'success') => {
    return async dispatch => {
        dispatch(setNotification({ message, type }))
        setTimeout(() => {
            dispatch(clearNotification())
        }, 5000)
    }
}

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer