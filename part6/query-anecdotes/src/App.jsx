import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, updateAnecdote } from './request'
import { setNotificationWithTimeOut, useNotificationDispatch } from './NotificationContext'

const App = () => {
  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()
  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    // throwOnError: true,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], 
        anecdotes.map(a => a.id === updatedAnecdote.id ? updatedAnecdote : a)).sort((a, b) => b.votes - a.votes)
    },
    // onError: (error) => {
    //   setNotificationWithTimeOut('error in voting')(dispatch)
    // }
  })

  const handleVote = (anecdote) => {
    console.log('vote')
    console.log(anecdote.id)
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
    setNotificationWithTimeOut(`anecdote ${anecdote.content} voted`)(dispatch)
  }


  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  })

  if (result.isLoading) {
    return <div>Loading...</div>
  }

  if (result.isError) {
    return <div>anecdote service is not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
