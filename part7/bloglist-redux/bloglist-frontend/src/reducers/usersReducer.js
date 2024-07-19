import { createSlice } from "@reduxjs/toolkit";
import usersService from "../services/users";

const usersSlice = createSlice({
    name: 'users',
    initialState: [],
    reducers: {
        setUsers(state, action) {
            return action.payload
        },
        addUserBlog(state, action) {
            const blog = action.payload
            const userId = blog.user.id
            return state.map(user => 
                user.id !== userId
                ? user
                : {
                    ...user,
                    blogs: 
                    {
                        title: blog.title,
                        author: blog.author,
                        url: blog.url,
                        id: blog.id
                    }
                }    
            )
        },
        removeUserBlog(state, action) {
            const blog = action.payload
            const userId = blog.user.id
            return state.map(user =>
                user.id === userId
                ? {
                    ...user,
                    blogs: user.blogs.filter(b => b.id !== blog.id)
                }
                : user
            )
        }
    }
})

export const initializeUsers = () => {
    return async dispatch => {
        const users = await usersService.getAll()
        dispatch(setUsers(users))
    }
}

export const { setUsers, addUserBlog, removeUserBlog } = usersSlice.actions
export default usersSlice.reducer