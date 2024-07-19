import { Link, useNavigate } from "react-router-dom"
import { logout } from "../reducers/userReducer"
import { useDispatch, useSelector } from "react-redux"

const NavigateBar = () => {
    const padding = {
        paddingRight: 5.,
        display: 'inline-block',
        marginRight: '10px'
    }
    const color = {
        backgroundColor: 'lightgrey'
    }
    const user = useSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout(user))
        navigate('/login')
    }
    return (
        <div style={color}>
            <Link to='/' style={padding}>blogs</Link>
            <Link to='/users' style={padding}>users</Link>
            {user
                ? 
                    <div style={padding}>
                        {user.name} logged in 
                        <button onClick={handleLogout}>logout</button>
                    </div>
                 
                : <button onClick={()=>navigate('/login')}>login</button>
            }
        </div>
    )
}

export default NavigateBar