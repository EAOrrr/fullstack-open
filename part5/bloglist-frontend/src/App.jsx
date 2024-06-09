import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginServer from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [message, setMessage] = useState(null)
  const [messageStatus, setMessageStatus] = useState(true)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  }, [])

  const handleLogin = async(event) => {
    event.preventDefault()
    console.log('try to login with', username, password)
    try {
      const user = await loginServer.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      console.log(user)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('wrong credentials')
      setMessage('wrong username or password')
      setMessageStatus(false)
      console.log(message, messageStatus)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }

  }

  const handleCreate = async(blogObject) => {
    // event.preventDefault()
    console.log('try to create blog with', blogObject)
    try {
      blogFormRef.current.toggleVisibility()
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog).sort((a, b) => b.likes - a.likes))
      setMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setMessageStatus(true)
      setTimeout(() => {
        setMessage(null)
      }, 5000)

    } catch (exception) {
      console.log(exception)
    }
  }

  const handleLike = async (blogObject) => {

    try {
      const newBlog = await blogService.update(blogObject.id, blogObject)
      console.log(newBlog)
      setBlogs(blogs
        .map(blog => blog.id !== blogObject.id
          ? blog
          : newBlog)
        .sort((a, b) => b.likes - a.likes)
      )
      console.log('success')
    }
    catch(exception) {
      console.log(exception.name)
    }
  }

  const handleRemove = async (blogObject) => {
    try {
      if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)) {
        await blogService.deleteId(blogObject.id)
        setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
      }
    }
    catch (exception) {
      console.log(exception)
    }
  }

  const loginForm = () => {
    if (user === null) {
      // show login form
      return (
        <form onSubmit={handleLogin}>
          <div>
            username
            <input type='text' value={username} name='Username' onChange={({ target }) => setUsername(target.value)}/>
          </div>
          <div>
            password
            <input type='password' value={password} name='Password' onChange={({ target }) => setPassword(target.value)}/>
          </div>
          <button type='submit'>login</button>
        </form>
      )
    }
  }
  const blogFormRef = useRef()
  const blogForm = () => {
    // else {
    // show blog form
    return (
      <div>
        {/* blogs */}
        <div>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} likeBlog={handleLike} removeBlog={handleRemove} ownership={user.username === blog.user.username}/>
          )}
        </div>

        {/*create new blog */}
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <BlogForm createBlog={handleCreate} />
        </Togglable>
      </div>
    )
    // }
  }

  if (user) {
    console.log('user: ', user)
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} status={messageStatus} />
      {!user && loginForm()}
      {user &&
            <p>
              {user.username} logged in
              <button
                onClick={() => {
                  window.localStorage.removeItem('loggedNoteappUser')
                  setUser(null)
                }}>
                logout
              </button>
            </p>
      }
      {user && blogForm()}
    </div>
  )
}

export default App