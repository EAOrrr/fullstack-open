import { useEffect, useState } from "react"

import { useDispatch, useSelector } from "react-redux"
import { initializeUsers } from "../reducers/usersReducer"
import { Link } from "react-router-dom"
import { Paper, TableBody, TableCell, TableContainer, TableRow, Table } from "@mui/material"

const Users = () => {
    const users = useSelector(state => state.users)
    console.log(users)
    return (
        <div>
            <h1>Users</h1>
            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell><strong>blogs created</strong></TableCell>
                        </TableRow>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Link to={`/users/${user.id}`}>
                                    {user.name}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    {user.blogs.length}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* <table>
                <tbody>
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
                </tbody>
            </table> */}
        </div>
    )
}

export default Users