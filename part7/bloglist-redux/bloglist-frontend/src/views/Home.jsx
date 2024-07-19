import { useSelector } from "react-redux"
import { createRef } from "react"
import Blog from "../components/Blog"
import Togglable from "../components/Togglable"
import NewBlog from "../components/NewBlog"


const Home = () => {
    const blogs = useSelector(state => state.blogs)
    const blogFormRef = createRef()
    return (
        <div>
            <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                <NewBlog  />
            </Togglable>
            {blogs.map(blog =>
                <Blog
                key={blog.id}
                blog={blog}
                />
            )}
        </div>
    )
}

export default Home