const Notification = ({ message, status }) => {
  if (message === null) {
    return null
  }
  const className = status?'message': 'error'
  console.log('classname', className, status)

  return (
    <div className={className}>
      {message}
    </div>
  )
}

export default Notification