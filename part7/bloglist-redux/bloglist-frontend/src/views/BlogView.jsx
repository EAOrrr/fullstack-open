import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { commentBlog, likeBlog, removeBlog } from "../reducers/blogReducer"
import storage from "../services/storage"
import { useField } from '../hooks'

const BlogView = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const comment = useField('text')
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
        dispatch(commentBlog(blog, comment.value))
        comment.onReset()
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
                    <input {...comment} />
                    <button type="submit">add comment</button>
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