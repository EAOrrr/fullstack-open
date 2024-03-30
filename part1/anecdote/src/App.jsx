import { useState } from 'react'
const Button = ({onSmash, text}) => <button onClick={onSmash}>{text}</button>

const Header = ({header}) => <h1>{header}</h1>

function IndexOfMax(arr) {
  if (arr.length === 0) {
    return -1
  }
  let max = 0
  let maxVal = arr[0]
  for (let i = 1; i < arr.length; i++) {
    if (maxVal > arr[i]) {
      max = i
      maxVal = arr[i]
    }
  }
  return max
}
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  const [maxVote, setMaxVote] = useState(Math.floor(Math.random() * anecdotes.length))
  const clickOnVote = () => {
    const newVotes = [...votes]
    let newMax = maxVote
    newVotes[selected] += 1
    if (newVotes[selected] > newVotes[maxVote]) {
      newMax = selected
    }
    setVotes(newVotes)
    setMaxVote(newMax)
  }
   
  const [selected, setSelected] = useState(Math.floor(Math.random() * anecdotes.length))
  console.log(votes)
  console.log(maxVote)
  return (
    <div>
      <Header header={'Anecdote of the day'}/>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes.</p>
      <Button onSmash={clickOnVote} text='vote'/>
      <Button onSmash={()=>setSelected(Math.floor(Math.random() * anecdotes.length))} text='next anecdote'></Button>
      <Header header={'Anecdote with most votes'}/>
      <p>{anecdotes[maxVote]}</p>
      <p> has {votes[maxVote]} </p>
    </div>
  )
}

export default App
