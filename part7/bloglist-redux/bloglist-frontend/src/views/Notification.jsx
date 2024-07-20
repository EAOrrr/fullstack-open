import { Alert } from '@mui/material'
import { useSelector } from 'react-redux'

const Notification = () => {
  const {message, type} = useSelector(state => state.notification)

  return (
    <div>{(message &&
      <Alert severity={type}>
        {message}
      </Alert>)}</div>
  )
}

export default Notification