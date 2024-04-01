const Total = ({course}) => {
  return (
    <p><strong> total of {course.parts.reduce(
      (sum, part)=> sum + part.exercises, 0)} exercises
    </strong></p>
  )
}

export default Total