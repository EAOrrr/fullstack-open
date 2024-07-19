import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { likeBlog } from "../reducers/blogReducer"

const BlogView = () => {
    const dispatch = useDispatch()
    const id = useParams().id
    const blog = useSelector(state => state.blogs.find(b => b.id===id))
    if (!blog) {
        return null
    }
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
            <p>added by {blog.user.name}</p>
        </div>
    )
}

export default BlogView