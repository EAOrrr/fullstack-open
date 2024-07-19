import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Notification from "./Notification"
import Login from "../components/Login"
import { login, logout } from "../reducers/userReducer"


const Header = () => {
    
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)

    const padding = {paddingRight: 5}


    return (
        <h2>blogs</h2>
    )
}

export default Header