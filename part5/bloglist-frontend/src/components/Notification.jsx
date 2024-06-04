const Notification = ({message, status}) => {
    if (message === null) {
        return null
    }
    const classname = status === true
        ? 'message'
        : 'error'

    return (
        <div className={classname}>
            {message}
        </div>
    )
}

export default Notification