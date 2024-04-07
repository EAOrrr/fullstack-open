const Person = ({person, DeletePerson}) => {
  return (
  <div>
    {person.name}{person.number}
    <button onClick={DeletePerson}>delete</button>
  </div>
  )
}

const Persons = ({persons, filterPerson, deletePersonOf}) => {
  const personToShow = filterPerson === ''? 
    persons: persons.filter(p=>p.name.toLowerCase().includes(filterPerson.toLowerCase()))
  return personToShow.map(p => 
    <Person key={p.id} person={p} DeletePerson={() => deletePersonOf(p.id)}/>
  )
}
export default Persons