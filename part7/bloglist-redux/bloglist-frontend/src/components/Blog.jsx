import React, { useState } from 'react'
import PropTypes from 'prop-types'
import storage from '../services/storage'
import { useDispatch } from 'react-redux'
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import { createNotification } from '../reducers/notificationReducer'

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
    try {
      await dispatch(likeBlog(blog))
      dispatch(createNotification(`You liked ${blog.title} by ${blog.author}`))
    }
    catch (error) {
      console.error(error)
      dispatch(createNotification('Failed to like blog', 'error'))
    }
  }

  const remove = async (blog) => {
    console.log('remove', blog)
    try {
      await dispatch(removeBlog(blog))
      dispatch(createNotification(`Blog removed: ${blog.title}, ${blog.author}`))
    }
    catch (error) {
      console.error(error)
      dispatch(createNotification('Failed to remove blog', 'error'))
    }
  }

  // console.log(blog.user, storage.me(), canRemove)

  return (
    <div style={style} className='blog'>
      {blog.title} by {blog.author}
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