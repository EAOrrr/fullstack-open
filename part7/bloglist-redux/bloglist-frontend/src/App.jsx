import { useEffect, createRef } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

import Login from './components/Login'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Users from './views/Users'
import User from './views/User'
import Togglable from './components/Togglable'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, logout, login } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'
import Header from './views/Header'
import Home from './views/Home'
import BlogView from './views/BlogView'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    dispatch(initializeUser())
  }, [])

  useEffect(() => {
      // fetch users
      dispatch(initializeUsers())
  }, [])

  const handleLogin = (credentials) => {
      dispatch(login(credentials))
  }

  const handleLogout = () => {
      dispatch(logout(user))
  }


  return (
    <Router>
        <Header />
        <Notification />
          {user 
              ? <div>
                  {user.name} logged in 
                  <button onClick={handleLogout}>logout</button>
              </div> 
              : <Login doLogin={handleLogin} />
          }
        
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/users' element={<Users />} />
        <Route path='/users/:id' element={<User />} />
        <Route path='/blogs/:id' element={<BlogView />} />
      </Routes>
    </Router>
  )
}

export default App