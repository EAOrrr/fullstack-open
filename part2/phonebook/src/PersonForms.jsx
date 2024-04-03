const InputText = ({name, value, onChange}) => (
  <div>
    {name}: <input value={value} onChange={onChange}/>
  </div>
)
    

const PersonForms = ({addName, newPerson, newNumber, handlePersonChange, handleNumberChange}) => (
   <form onSubmit={addName}>
        <div>
            <InputText name={'name'} value={newPerson} onChange={handlePersonChange}/>
            <InputText name={'number'} value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
)

export default PersonForms