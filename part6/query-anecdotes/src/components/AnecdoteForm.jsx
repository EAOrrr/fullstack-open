import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAnecdote } from "../request"
import { setNotificationWithTimeOut, useNotificationDispatch } from "../NotificationContext"

const AnecdoteForm = () => {
  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      // queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value

    event.target.anecdote.value = ''
    console.log('new anecdote')
    newAnecdoteMutation.mutate(
      {content, votes: 0}, 
      {onSuccess: () => setNotificationWithTimeOut(`anecdote ${content} created`),
      onError: (error) => {
        console.log(error.response.data.error)
        setNotificationWithTimeOut(error.response.data.error)(dispatch)
      }}
    )
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
