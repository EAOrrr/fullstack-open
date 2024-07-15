import { useNotificationValue } from "../NotificationContext"
const Display = () => {
  const notification = useNotificationValue()
  return <div>
    {notification}
  </div>
}

export default Display