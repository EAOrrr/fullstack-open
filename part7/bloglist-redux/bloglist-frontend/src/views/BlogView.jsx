import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { likeBlog, removeBlog } from "../reducers/blogReducer"
import storage from "../services/storage"

const BlogView = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const id = useParams().id
    const blog = useSelector(state => state.blogs.find(b => b.id===id))
    if (!blog) {
        return null
    }
    const canRemove = blog.user? blog.user.username === storage.me() : true
    const nameOfUser = blog.user ? blog.user.name : 'anonymous'

    return (
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
    )
}

export default BlogView