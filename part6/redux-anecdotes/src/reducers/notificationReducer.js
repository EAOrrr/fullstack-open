import { createSlice } from "@reduxjs/toolkit";

const initialState = ''

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotification(state, action) {
            return action.payload
        },
        clearNotification(state, action) {
            return initialState
        }
    }
})

export const createNotification = (message, time) => {
    return dispatch => {
        dispatch(setNotification(message))
        setTimeout(() => {
            dispatch(clearNotification())
        }, time)
    }
}

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer