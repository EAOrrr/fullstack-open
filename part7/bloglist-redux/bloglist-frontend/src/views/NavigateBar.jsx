import { Link, useNavigate } from "react-router-dom"
import { logout } from "../reducers/userReducer"
import { useDispatch, useSelector } from "react-redux"
import { AppBar, Button, IconButton, Toolbar } from "@mui/material"

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
        // <div style={color}>
        //     <Link to='/' style={padding}>blogs</Link>
        //     <Link to='/users' style={padding}>users</Link>
        //     {user
        //         ? 
        //             <div style={padding}>
        //                 {user.name} logged in 
        //                 <button onClick={handleLogout}>logout</button>
        //             </div>
                 
        //         : <button onClick={()=>navigate('/login')}>login</button>
        //     }
        // </div>
        <AppBar position="static">
            <Toolbar>
                <IconButton edge='start' color='inherit' aria-label="menu"></IconButton>
                <Button color='inherit' component={Link} to='/'>
                    Home
                </Button>
                <Button color='inherit' component={Link} to='/users'>
                    Users
                </Button>
                {user
                    ? <div>
                        {user.name} logged in
                        <Button onClick={handleLogout} color='inherit'>logout</Button>
                    </div>
                    :<Button color='inherit' component={Link} to='/Login'>login</Button>}

            </Toolbar>
        </AppBar>
    )
}

export default NavigateBar