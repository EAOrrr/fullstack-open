import { useState } from 'react'

const Login = ({ doLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    doLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={handleLogin}>
      <label>
        Username:
        <input
          type="text"
          data-testid='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)} />
      </label>
      <br></br>
      <label>
        Password:
        <input
          type="password"
          value={password}
          data-testid='password'
          onChange={(e) => setPassword(e.target.value)} />
      </label>
      <br></br>
      <input type="submit" value="Login" />
    </form>
  )
}

export default Login