const loginForm = ({
  handleLogin,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
                    username
          <input type="text" value={username} onChange={handleUsernameChange}/>
        </div>
        <div>
                    password
          <input type="password" value={password} onChange={handlePasswordChange}/>
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default loginForm