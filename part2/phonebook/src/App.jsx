import { useState, useEffect } from 'react'
import axios from 'axios'
import PersonForms from './components/PersonForms'
import Filter from './components/Filter'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'

const handleChange = (setFunction) => {
    return event => {
      console.log(event.target.value)
      setFunction(event.target.value)
    }
}


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newPerson, setNewPerson] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterPerson, setFilterPerson] = useState('')
  const [message, setMessage] = useState('')
  const [messageStatus, setMessageStatus] = useState(true)

  useEffect(() => {
    console.log('effect');
    personService.getAll().then(initialPersons => {
      console.log('promise fullfilled')
      setPersons(initialPersons)
    })
    }, [])
  
  const addName = (event) => {
    console.log('-------addName called-------------')
    event.preventDefault()
    const personObject = {
      name: newPerson,
      number: newNumber,
      id: (persons.length + 1).toString()
    }
    const person = persons.find(p => p.name === newPerson)
    if (person != undefined) {
      if (window.confirm(`${newPerson}is already added to phonebook,
       replace the old number with a new one?`)) {
        const changedPerson = {...person, number: newNumber}
        personService.update(person.id, changedPerson).then(returnedPerson => {
          setPersons(persons.map(p => p.name === newPerson? returnedPerson: p))
          setMessage(`${person.name}'s number has been changed.`)
          setMessageStatus(true)
          setTimeout(()=>{
            setMessage(null)
          }, 5000)
        }).catch(error => {
          // part2 
          // setMessage(`Information of '${person.name}' was already deleted from server`)
          // setPersons(persons.filter(p => p.name !== person.name))
          // part3
          setMessage(`Error occurs when updating ${person.name}.`)
          setMessageStatus(false) 
          personService.getAll().then(persons => setPersons(persons))
          setTimeout(()=>{
            setMessageStatus(true)
            setMessage(null)
          }, 5000)
        })
        
      }
    }
    else {
      personService
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response))
        setMessage(`Added ${newPerson}`)
        setNewNumber('')
        setNewPerson('')
        setMessageStatus(true)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        setMessage(error.response.data.error)
        setMessageStatus(false)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
    }
  }

  const deletePersonOf = id => {
    console.log('-------------deletePerson called---------------')
    const person = persons.find(p => p.id === id)
    if (person === undefined) {
      alert(`person not found`)
      return
    }
    if (window.confirm(`Delete ${person.name}`)) {
      personService.deleteID(id).then(returnedPerson => {
        console.log('after filter', persons.filter(p => p.id !== id) )
        setPersons(persons.filter(p => p.id !== id))
      }).catch(error => {
          setMessage(`Information of '${person.name}' was already deleted from server`)
          setMessageStatus(false)
          setPersons(persons.filter(p => p.name !== person.name))
          
          setTimeout(()=>{
            setMessageStatus(true)
            setMessage(null)
          }, 5000)
        })
    }

  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} status={messageStatus}/>
      <div>
      <Filter filterPersons={filterPerson} handleFilterChange={handleChange(setFilterPerson)}/>
      </div>
      <h2>add a new</h2>
      <PersonForms addName={addName} newPerson={newPerson} newNumber={newNumber} 
         handlePersonChange={handleChange(setNewPerson)} handleNumberChange={handleChange(setNewNumber)}/> 
      <h2>Numbers</h2>
      <Persons persons={persons} filterPerson={filterPerson} deletePersonOf={deletePersonOf}/>
    </div>
  )
}

export default App