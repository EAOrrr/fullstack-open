import { useEffect, useState } from "react"

import { useDispatch, useSelector } from "react-redux"
import { initializeUsers } from "../reducers/usersReducer"
import { Link } from "react-router-dom"

const Users = () => {
    const users = useSelector(state => state.users)
    console.log(users)
    return (
        <div>
            <h1>Users</h1>
            <table>
                <tr>
                    <td></td>
                    <td><strong>blogs created</strong></td>
                </tr>
                {users.map(
                    user =>
                        <tr key={user.id}>
                           <td>
                            <Link to={`/users/${user.id}`}>
                            {user.name}
                            </Link>
                            </td>
                           <td>{user.blogs.length}</td>
                        </tr>
                )}
            </table>
        </div>
    )
}

export default Users