import { useState } from 'react'
import PersonForms from './PersonForms'
import Filter from './Filter'
import Persons from './Persons'

const InList = (element, list) => {
  console.log(element)
  console.log(list)
  for(const e of list) {
    if (element.name == e.name && element.number == e.number) {
      return true
    }
  }
  return false
}


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1}
  ]) 
  const [newPerson, setNewPerson] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterPerson, setFilterPerson] = useState('')
  
  const addName = (event) => {
    console.log('-------addName called-------------')
    event.preventDefault()
    const personObject = {
      name: newPerson,
      number: newNumber,
      id: persons.length + 1
    }
    if (InList(personObject, persons)) {
      alert(`${newPerson}${newNumber} is already added to phonebook`)
    }
    else {
      setPersons(persons.concat(personObject))
    }
  }

  const handlePersonChange = event => {
    console.log(event.target.value);
    setNewPerson(event.target.value)
  }

  const handleNumberChange = event =>{
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = event => {
    console.log(event.target.value)
    setFilterPerson(event.target.value)
  }

  const personToShow = filterPerson === ''? persons: persons.filter(p=>p.name === filterPerson)
  console.log('---------persons in filter--------------')
  console.log(persons)
  console.log(persons.filter(p=>p === filterPerson))
  console.log(personToShow)
  console.log(personToShow.map(p => p.name))
  console.log(personToShow.map(p => p.number))

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
      <Filter filterPersons={filterPerson} handleFilterChange={handleFilterChange}/>
      </div>
      <h2>add a new</h2>
      <PersonForms addName={addName} newPerson={newPerson} newNumber={newNumber} handlePersonChange={handlePersonChange} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons persons={personToShow}/>
    </div>
  )
}

export default App