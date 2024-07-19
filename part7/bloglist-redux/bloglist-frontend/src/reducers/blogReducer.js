import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { createNotification } from './notificationReducer'
import { addUserBlog, removeUserBlog } from './usersReducer'

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
        },
        addComment(state, action) {
            const {id, comment} = action.payload
            return state.map(b => 
                b.id === id
                ? {
                    ...b,
                    comments: b.comments.concat(comment)
                }
                : b
            )
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
        try {
            const likedBlog = await blogService.update(blog.id, {
                ...blog, likes: blog.likes + 1
            })
            console.log('likedBlog', likedBlog)
            dispatch(updateBlog(likedBlog))
            dispatch(createNotification(`You liked ${likedBlog.title}`))
        }
        catch (error) {
            console.error(error)
            dispatch(createNotification('Failed to like the blog', 'error'))
        }
    }
}

export const createBlog = blog => {
    return async dispatch => {
        try {
            const newBlog = await blogService.create(blog)
            dispatch(appendBlog(newBlog))
            dispatch(createNotification(`A new blog ${newBlog.title} by ${newBlog.author} added`))
            dispatch(addUserBlog(newBlog))
        }
        catch (error) {
            console.error(error)
            dispatch(createNotification('Failed to create a new blog', 'error'))
        }
    }
}

export const removeBlog = blog => {
    return async dispatch => {
        try {
            await blogService.remove(blog.id)
            dispatch(deleteBlog(blog))
            dispatch(removeUserBlog(blog))
            dispatch(createNotification(`You removed ${blog.title}`))
        }
        catch (error) {
            console.error(error)
            dispatch(createNotification('Failed to remove the blog', 'error'))
        }
    }
}

export const commentBlog = (blog, comment) => {
    return async dispatch => {
        try {
            await blogService.addComment(blog.id, {comment})
            dispatch(addComment({id: blog.id, comment}))
            dispatch(createNotification(`You commented ${blog.title}`))
        }
        catch(error) {
            console.error(error)
            dispatch(createNotification('Failed to comment the blog', 'error'))
        }
    }
}

export const { updateBlog, appendBlog, setBlogs, deleteBlog, addComment } = blogSlice.actions
export default blogSlice.reducer