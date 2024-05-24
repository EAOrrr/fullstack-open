const express = require("express")
const app = express()
require('dotenv').config()

const Person = require('./models/persons')
const morgan = require("morgan")

app.use(express.static('dist'))

morgan.token('content', (request, ) => {
  return JSON.stringify(request.body)
})

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  } else if (error.name == 'ValidationError') {
    return response.status(400).send({error: error.message})
  }

  next(error)
}

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.get('/', (request, response) => {
  response.send('<h1> Phonebook App</h1>')
})

app.get('/info', (request, response) => {
    let now = new Date().toDateString() + ' ' + new Date().toTimeString()
    response.send(`<p>Phonebook has info for 2 people</p><p>${now}</p>`)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then(() => {
        response.status(204).end()
      })
      .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    // missing: check if the name already exists in the phonebook
    const person = new Person({
      name: body.name,
      number: body.number 
    })

    person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body
  Person.findByIdAndUpdate(request.params.id, 
    {name, number},
    {new: true, runValidators: true, context: 'query'}
  )
  .then(updatedPerson => {
    if (updatedPerson) {
      response.json(updatedPerson)
    }
    else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})



app.use(unknownEndpoint)
app.use(errorHandler)// Followed the steps in part a, but I can't access resource after the deployment 
// After 3 days of checking, 
// I realized that I forgot to add process.env.PORT || myport here.
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
