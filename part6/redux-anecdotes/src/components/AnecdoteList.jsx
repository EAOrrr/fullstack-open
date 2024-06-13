import { useSelector, useDispatch } from "react-redux"
import { voteAnecdote } from "../reducers/anecdoteReducer"
import { createNotification } from "../reducers/notificationReducer"
const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    console.log('in AnecdoteList: ', state)
    return (
    state.filter === ''
      ? state.anecdotes
      : state.anecdotes.filter(a => a.content.toLowerCase().includes(state.filter.toLowerCase()))
    )
  })
  console.log('anecdotes: ', anecdotes)
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    console.log('vote', anecdote)
    dispatch(voteAnecdote(anecdote))
    dispatch(createNotification('you voted \'' + anecdote.content + '\'', 3000))
  }

  return (
    <div>
    {anecdotes.map(anecdote => 
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => vote(anecdote)}>vote</button>
        </div>
      </div>
    )} 
    </div>
    )
}

export default AnecdoteList