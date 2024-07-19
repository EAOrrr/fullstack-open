import React, { useState } from 'react'
import PropTypes from 'prop-types'
import storage from '../services/storage'
import { useDispatch } from 'react-redux'
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)

  const nameOfUser = blog.user ? blog.user.name : 'anonymous'

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  const canRemove = blog.user ? blog.user.username === storage.me() : true

  const like = async (blog) => {
    console.log('like', blog)
    dispatch(likeBlog(blog))
  }

  const remove = async (blog) => {
    console.log('remove', blog)
    dispatch(removeBlog(blog))
  }

  // console.log(blog.user, storage.me(), canRemove)

  return (
    <div style={style} className='blog'>
      <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
      <button style={{ marginLeft: 3 }} onClick={() => setVisible(!visible)}>
        {visible ? 'hide' : 'view'}
      </button>
      {visible && (
        <div>
          <div><a href={blog.url}>{blog.url}</a></div>
          <div>
            likes {blog.likes}
            <button
              style={{ marginLeft: 3 }}
              onClick={() => like(blog)}
            >
              like
            </button>
          </div>
          <div>{nameOfUser}</div>
          {canRemove && <button onClick={() => remove(blog)}>
            remove
          </button>}
        </div>
      )}

    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.object,
  }).isRequired,
}

export default Blog