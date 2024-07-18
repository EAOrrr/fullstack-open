import React, { useState } from 'react'
import { useField } from '../hooks'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { createNotification } from '../reducers/notificationReducer'

const NewBlog = () => {
  const dispatch = useDispatch()

  const title = useField('text')
  const url = useField('text')
  const author = useField('text')

  const handleSubmit = async event => {
    event.preventDefault()
    const newBlog = {
      title: title.value,
      url: url.value, 
      author: author.value
    }
    try {
      await dispatch(createBlog(newBlog))
      title.onReset()
      url.onReset()
      author.onReset()
      dispatch(createNotification(`A new blog ${title.value} by ${author.value} added`))
    }
    catch (error) {
      console.error(error)
      dispatch(createNotification('Failed to create blog', 'error'))
    }
  }

  return (
    <div>
      <h2>Create a New Blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input {...title}
          />
        </div>
        <div>
          <label>URL:</label>
          <input {...url}
          />
        </div>
        <div>
          <label>Author:</label>
          <input {...author}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default NewBlog