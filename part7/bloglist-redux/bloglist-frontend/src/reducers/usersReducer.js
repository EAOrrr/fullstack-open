import { createSlice } from "@reduxjs/toolkit";
import usersService from "../services/users";

const filterPart = (blog) => {
    return ({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        id: blog.id,
        user: blog.user? blog.user.id: undefined
    })
}

const usersSlice = createSlice({
    name: 'users',
    initialState: [],
    reducers: {
        setUsers(state, action) {
            const users = action.payload
            console.log('setUsers', users)
            console.log('return', users.map(user => (
                {
                    ...user,
                    blogs: user.blogs.map(b => ({...filterPart(b), user:user.id}))
                })
            ))
            return users.map(user => (
                {
                    ...user,
                    blogs: user.blogs.map(b => ({...filterPart(b), user:user.id}))
                })
            )
        },
        addUserBlog(state, action) {
            const newBlog = filterPart(action.payload)
            console.log('newBlog', newBlog)
            const userId = newBlog.user
            return state.map(user => 
                user.id !== userId
                ? user
                : {
                    ...user,
                    blogs: 
                    user.blogs.concat({
                        title: newBlog.title,
                        author: newBlog.author,
                        url: newBlog.url,
                        id: newBlog.id
                    })
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
        console.log('initialize', users)
        dispatch(setUsers(users))
    }
}

export const { setUsers, addUserBlog, removeUserBlog } = usersSlice.actions
export default usersSlice.reducer