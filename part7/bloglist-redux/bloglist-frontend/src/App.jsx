import { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  Navigate
} from 'react-router-dom'

import Login from './components/Login'
import Notification from './views/Notification'
import Users from './views/Users'
import User from './views/User'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'
import Header from './views/Header'
import Home from './views/Home'
import BlogView from './views/BlogView'
import NavigateBar from './views/NavigateBar'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    dispatch(initializeUser())
  }, [])

  useEffect(() => {
      dispatch(initializeUsers())
  }, [])


  return (
    <Router>
        <NavigateBar />
        <Header />
        <Notification />
        
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={!user? <Login /> : <Navigate replace to="/" />} />
        <Route path='/users' element={<Users />} />
        <Route path='/users/:id' element={<User />} />
        <Route path='/blogs/:id' element={<BlogView />} />
      </Routes>
    </Router>
  )
}

export default App