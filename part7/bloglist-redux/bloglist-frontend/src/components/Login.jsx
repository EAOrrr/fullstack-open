import { useField } from '../hooks'
import { useDispatch } from 'react-redux'
import { login } from '../reducers/userReducer'
import { useState } from 'react'
import { Button, TextField } from '@mui/material'

const Login = () => {
  const dispatch = useDispatch()
  // const username = useField('text')
  // const password = useField('password')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    dispatch(login(
      { username,
        password
      })
    )
    // username.onReset()
    // password.onReset()
    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={handleLogin}>
      <div><TextField label='username' onChange={({target}) => setUsername(target.value)}/></div>
      <div><TextField label='password' type='password' onChange={({target}) => setPassword(target.value)}/></div>
      <div><Button variant='contained' color='primary' type='submit'>login</Button></div>
      {/* <label>
        Username:
        <input
        {...username}
          />
      </label>
      <br></br>
      <label>
        Password:
        <input
        {...password}
        />
      </label>
      <br></br>
      <input type="submit" value="Login" /> */}
    </form>
  )
}

export default Login