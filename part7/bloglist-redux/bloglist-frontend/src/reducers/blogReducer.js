import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const byLikes = (a, b) => b.likes - a.likes

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        updateBlog(state, action) {
            console.log(action.payload)
            const id = action.payload.id
            return state
                .map(blog => 
                    blog.id === id
                    ? action.payload
                    : blog
                )
                .sort(byLikes)
        },
        appendBlog(state, action) {
            state.push(action.payload)
        },
        setBlogs(state, action) {
            return action.payload.sort(byLikes)
        },
        deleteBlog(state, action) {
            return state.filter(blog => blog.id !== action.payload.id)
        }
    }
})

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogService.getAll()
        dispatch(setBlogs(blogs))
    }
}

export const likeBlog = blog => {
    return async dispatch => {
        const likedBlog = await blogService.update(blog.id, {
            ...blog, likes: blog.likes + 1
        })
        console.log('likedBlog', likedBlog)
        dispatch(updateBlog(likedBlog))
    }
}

export const createBlog = blog => {
    return async dispatch => {
        const newBlog = await blogService.create(blog)
        dispatch(appendBlog(newBlog))
    }
}

export const removeBlog = blog => {
    return async dispatch => {
        await blogService.remove(blog.id)
        dispatch(deleteBlog(blog))
    }
}

export const { updateBlog, appendBlog, setBlogs, deleteBlog } = blogSlice.actions
export default blogSlice.reducer