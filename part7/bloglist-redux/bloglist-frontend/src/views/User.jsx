import { useParams } from "react-router-dom"
import usersService from "../services/users"
import { useSelector } from "react-redux"
const User = () => {
  const id = useParams().id
  const user = useSelector(state => state.users.find(u => u.id === id))
  if (!user) {
    return null
  }

  return (
    <div>
      {user.blogs.map(
        b => (
          <li key={b.id}>
            {b.title}
          </li>
        )
      )}
    </div>
  )
}

export default User