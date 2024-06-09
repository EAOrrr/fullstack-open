import { useState } from 'react'
const Blog = ({ blog, likeBlog, removeBlog, ownership }) => {
  const [visible, setVisible] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async (event) => {
    event.preventDefault()
    console.log('like', blog.title)
    const newBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    console.log('after like', newBlog)
    likeBlog(newBlog)

  }

  const handleRemove = async (event) => {
    event.preventDefault()
    console.log('remove: ', blog.title)
    removeBlog(blog)
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  return (
    <div className='blog' style={blogStyle}>
      {blog.title} {blog.author}
      <button style={hideWhenVisible} onClick={toggleVisibility}>view</button>
      <button style={showWhenVisible} onClick={toggleVisibility}>hide</button>
      <div className='detail' style={showWhenVisible}>
        <a href={blog.url}>{blog.url}</a><br></br>
        likes: {blog.likes} <button onClick={handleLike}>like</button><br></br>
        {blog.user.name}<br></br>
        {ownership && <button onClick={handleRemove}>remove</button>}
      </div>
    </div>
  )
}

export default Blog