const Filter = ({filterPersons, handleFilterChange}) => (
    <div>
      filter shown with
      <input value={filterPersons}
      onChange={handleFilterChange}
      />
    </div>
  )

export default Filter