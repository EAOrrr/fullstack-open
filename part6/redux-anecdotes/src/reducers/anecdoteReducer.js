import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdotes'

const byVotes = (a, b) => b.votes - a.votes

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    updateAnecdote(state, action) {
      const id = action.payload.id
      return state
        .map(anecdote => 
          anecdote.id === id
          ? action.payload
          : anecdote
        )
        .sort(byVotes)
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
    
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  } 
}

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    const changedAnecdote = await anecdoteService.update(anecdote.id, {
      ...anecdote, votes: anecdote.votes + 1
    })
    dispatch(updateAnecdote(changedAnecdote))
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const anecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(anecdote))
  }
}

export const { updateAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export default anecdoteSlice.reducer