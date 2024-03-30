import { useState } from 'react'
const Header = (props) => <h1>{props.header}</h1>

const Button = ({onSmash, text}) => <button onClick={onSmash}>{text}</button>

const Display = ({comment, number}) => <tr><td>{comment}</td><td> {number}</td></tr>

const Score = ({good, bad, all}) => <tr><td>average </td><td>{(good - bad)/ all}</td></tr>


const Positive = ({good, all}) => <tr><td>positive</td><td> {good / all * 100}%</td></tr>

const Statistics = (props) => {
  const {good, neutral, bad} = props
  let all = good + neutral + bad
  if (all === 0) {
    return <div>
      <p>No feedback given</p>
    </div>
  }
  return (
    <div>
    <Header header='statistics'/>
    <table>
      <tbody>
        <Display number={good} comment={'good'}/>
        <Display number={neutral} comment={'neutral'}/>
        <Display number={bad} comment={'bad'}/>
        <Display number={good + neutral + bad} comment={'all'}/>
        <Score good={good} bad={bad} all={all}/>
        <Positive good={good} all={all}/>
      </tbody>
    </table>

    </div>
  )

}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }
  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }
  const handleBadClick = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <Header header="give feedback"></Header>
      <Button onSmash={handleGoodClick} text={'good'}/>
      <Button onSmash={handleNeutralClick} text={'neutral'}/>
      <Button onSmash={handleBadClick} text={'bad'}/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App

