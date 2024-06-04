import { useState, useEffect, useInsertionEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginServer from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [message, setMessage] = useState(null)
  const [messageStatus, setMessageStatus] = useState(true)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


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
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async(event) => {
    event.preventDefault()
    console.log('try to login with', username, password)
    try {
      const user = await loginServer.login({username, password})
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

  const handleCreate = async(event) => {
    event.preventDefault()
    console.log('try to create blog with', title, author, url)
    try {
      const newBlog = await blogService.create({title, author, url})
      setBlogs(blogs.concat(newBlog))
      setMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setMessageStatus(true)
      setTitle('')
      setAuthor('')
      setUrl('')
      setTimeout(() => {
        setMessage(null)
      }, 5000)

    } catch (exception) {
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
            <input type='text' value={username} name='Username' onChange={({target}) => setUsername(target.value)}/>
          </div>
          <div>
            password
            <input type='password' value={password} name='Password' onChange={({target}) => setPassword(target.value)}/>
          </div>
          <button type='submit'>login</button>
        </form>
      )
    }
    else {
      // show blog form
      return (
        <div>
          {/*user and blogs */}
          <div>
            <p>
              {user.username} logged in
              <button 
                onClick={() => {
                  window.localStorage.removeItem('loggedBlogappUser')
                  setUser(null)
                }}>
                logout
                </button>
            </p>
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
          </div>

          {/*create new blog */}
          <div>
            <h2> create new</h2>
            <form onSubmit={handleCreate}>
              <div>
                title 
                <input type='text' value={title} name='Title' onChange={({target}) => setTitle(target.value)}/>
              </div>
              <div>
                author 
                <input type='text' value={author} name='Title' onChange={({target}) => setAuthor(target.value)}/>
              </div>
              <div>
                url 
                <input type='text' value={url} name='Title' onChange={({target}) => setUrl(target.value)}/>
              </div>
              <button type='submit'>create</button>
            </form>
          </div>
        </div>
        )
      }
    }
    

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} status={messageStatus} />
      {loginForm()}
    </div>
  )
}

export default App