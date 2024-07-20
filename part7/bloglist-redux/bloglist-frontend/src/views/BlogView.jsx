import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { commentBlog, likeBlog, removeBlog } from "../reducers/blogReducer"
import storage from "../services/storage"
import { useField } from '../hooks'
import { TextField, Button } from "@mui/material"
import { useState } from "react"

const BlogView = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [comment, setComment] = useState('')
    const id = useParams().id
    const blog = useSelector(state => state.blogs.find(b => b.id===id))
    if (!blog) {
        return null
    }
    const canRemove = blog.user? blog.user.username === storage.me() : true
    const nameOfUser = blog.user ? blog.user.name : 'anonymous'
    const handleAddComment = (event) => {
        event.preventDefault()
        console.log('hello world')
        dispatch(commentBlog(blog, comment))
        setComment('')
    }

    return (
        <div>
            <div>
                <h1>{blog.title}</h1>
                <p>{blog.likes} likes
                    <button onClick={() => {
                        console.log('like', blog)
                        dispatch(likeBlog(blog))}
                    }>
                    like</button>
                </p>
                <p>added by {nameOfUser}</p>
                {canRemove && 
                    <button onClick={() => {
                        dispatch(removeBlog(blog))
                        navigate('/')
                    }}>
                    remove
                    </button>}
            </div>
            <div>
                <h3>Comments</h3>
                <form onSubmit={handleAddComment} >
                    <TextField label='comment' required={true} onChange={({target})=>{setComment(target.value)}}/>
                    <br></br>
                    <Button variant='contained' color='primary' type='submit'>add comment</Button>
                </form>
                {blog.comments.map((c, idx) => {
                    return (
                        <li key={idx}>{c}</li>
                    )
                })}
            </div>
        </div>
    )
}

export default BlogView