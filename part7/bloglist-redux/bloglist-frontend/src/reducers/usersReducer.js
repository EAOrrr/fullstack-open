import { createSlice } from "@reduxjs/toolkit";
import usersService from "../services/users";
import blogs from "../services/blogs";

const filterPart = (blog) => {
    return ({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        id: blog.id
    })
}

const usersSlice = createSlice({
    name: 'users',
    initialState: [],
    reducers: {
        setUsers(state, action) {
            const users = action.payload
            return users.map(u => {
                return {
                    ...u,
                    blogs: u.blogs.map(b => filterPart(b))
                };
            })
        },
        addUserBlog(state, action) {
            const newBlog = filterPart(action.payload)
            const userId = newBlog.user.id
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
            // console.log(state.map(user =>
            //     user.id === userId
            //     ? {
            //         ...user,
            //         blogs: user.blogs.filter(b => b.id !== blog.id)
            //     }
            //     : user
            // ))
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