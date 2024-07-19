import { useField } from '../hooks'
import { useDispatch } from 'react-redux'
import { login } from '../reducers/userReducer'

const Login = () => {
  const dispatch = useDispatch()
  const username = useField('text')
  const password = useField('password')

  const handleLogin = (event) => {
    event.preventDefault()
    dispatch(login(
      { username: username.value, 
        password: password.value 
      })
    )
    username.onReset()
    password.onReset()
  }

  return (
    <form onSubmit={handleLogin}>
      <label>
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
      <input type="submit" value="Login" />
    </form>
  )
}

export default Login