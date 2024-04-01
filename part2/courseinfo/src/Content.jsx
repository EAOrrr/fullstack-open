const Part = ({ part }) =>  <p>{part.name} {part.exercises}</p>

const Content = ({ course }) => {
  console.log('content', course)
  return (
    course.parts.map(
      (part) => {
        console.log('part', part)
        return(
        <div key={part.id}>
          <Part part={part}/>
        </div>)
      }
    )
  )
}

export default Content