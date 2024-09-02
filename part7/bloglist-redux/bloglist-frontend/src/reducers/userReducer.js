import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import storage from "../services/storage";
import { createNotification } from "./notificationReducer";

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    removeUser(state) {
      return null
    }
  }
})

export const initializeUser = () => {
    return dispatch => {
        const user = storage.loadUser()
        if (user) {
            dispatch(setUser(user))
        }
    }
}

export const login = (credentials) => {
    return async dispatch => {
        try {
            const user = await loginService.login(credentials)
            dispatch(setUser(user))
            storage.saveUser(user)
            dispatch(createNotification(`Welcome back, ${user.name}`))
        }
        catch (error) {
            dispatch(createNotification('Wrong credentials', 'error'))
        }
    }
}

export const logout = (user) => {
    return dispatch => {
        storage.removeUser()
        dispatch(removeUser())
        dispatch(createNotification(`Bye, ${user.name}!`))
    }
}


export const { setUser, removeUser } = userSlice.actions
export default userSlice.reducer