import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Notification from "../components/Notification"
import Login from "../components/Login"
import { login, logout } from "../reducers/userReducer"


const Header = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)

    const padding = {paddingRight: 5}


    return (
        <div>
            {/* <Link to='/users' style={padding}>Users</Link>
            <Link to='/blogs' style={padding}>Blogs</Link> */}
            <a href='/users' style={padding}>Users</a>
            <a href='/blogs' style={padding}>Blogs</a>
            <h2>blogs</h2>
            
        </div>
    )
}

export default Header