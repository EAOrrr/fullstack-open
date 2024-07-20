import React, { useState } from 'react'
import { useField } from '../hooks'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { createNotification } from '../reducers/notificationReducer'
import { Button, TextField } from '@mui/material'

const NewBlog = () => {
  const dispatch = useDispatch()

  // const title = useField('text')
  // const url = useField('text')
  // const author = useField('text')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')

  const handleSubmit = async event => {
    event.preventDefault()
    const newBlog = {
      // title: title.value,
      // url: url.value, 
      // author: author.value
      title, author, url
    }
    dispatch(createBlog(newBlog))
    setTitle('')
    setUrl('')
    setAuthor('')
    // title.onReset()
    // url.onReset()
    // author.onReset()
  }

  return (
    <div>
      <h2>Create a New Blog</h2>
      <form onSubmit={handleSubmit}>
        <div><TextField label='Title' onChange={({target}) => setTitle(target.value)}/></div>
        <div><TextField label='Author' onChange={({target}) => setAuthor(target.value)}/></div>
        <div><TextField label='Url' onChange={({target}) => setUrl(target.value)}/></div>
        <div><Button color='secondary' variant='outlined' type='submit'>Create</Button></div>
        {/* <div>
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
        <button type="submit">Create</button> */}
      </form>
    </div>
  )
}

export default NewBlog