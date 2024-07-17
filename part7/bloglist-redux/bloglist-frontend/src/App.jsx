import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { useDispatch } from 'react-redux'
import { createErrorMessage, createSuccessMessage } from './reducers/notificationReducer'

const App = () => {
  const dispatch = useDispatch()
  const [allBlogs, setAllBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = React.createRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      getAllBlogs()
    }
  }, [])

  const getAllBlogs = async () => {
    const blogs = await blogService.getAll()
    setAllBlogs(blogs)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(createErrorMessage('Wrong credentials', 5000))
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const createBlog = async (BlogToAdd) => {
    try {
      blogFormRef.current.toggleVisibility()
      const createdBlog = await blogService
        .create(BlogToAdd)
      setAllBlogs(allBlogs.concat(createdBlog))
      dispatch(createSuccessMessage(`Blog ${BlogToAdd.title} was successfully added`, 5000))
    } catch(exception) {
      dispatch(createErrorMessage(`Cannot add blog ${BlogToAdd.title}`, 5000))
    }
  }

  const updateBlog = async (BlogToUpdate) => {
    try {
      const updatedBlog = await blogService
        .update(BlogToUpdate)
      console.log('success')
      setAllBlogs(allBlogs.map(blog => blog.id !== BlogToUpdate.id ? blog : updatedBlog))
      dispatch(createSuccessMessage(`Blog ${BlogToUpdate.title} was successfully updated`, 5000))
    } catch(exception) {
      dispatch(createErrorMessage(`Cannot update blog ${BlogToUpdate.title}`, 5000))
    }
  }

  const deleteBlog = async (BlogToDelete) => {
    console.log('delete Blog called')
    try {
      if (window.confirm(`Delete ${BlogToDelete.title} ?`)) {
        await blogService
          .remove(BlogToDelete.id)
        setAllBlogs(allBlogs.filter(blog => blog.id !== BlogToDelete.id))
        dispatch(createSuccessMessage(`Blog ${BlogToDelete.title} was successfully deleted`, 5000))
      }
    } catch(exception) {
      dispatch(createErrorMessage(`Cannot delete blog ${BlogToDelete.title}`, 5000))
    }
  }

  const byLikes = (b1, b2) => b2.likes - b1.likes

  return (
    <div>
      <h2>Blogs</h2>
      <Notification />
      {user === null ?
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          setPassword={setPassword}
          password={password}
        /> :
        <div>
          <p>{user.name} logged in<button onClick={handleLogout} type="submit">logout</button></p>
          <Togglable buttonLabel="Add new blog" ref={blogFormRef}>
            <BlogForm
              createBlog={createBlog}
            />
          </Togglable>
          {allBlogs.sort(byLikes).map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
            />
          )}
        </div>
      }
    </div>
  )
}

export default App
