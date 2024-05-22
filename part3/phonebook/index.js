const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()

app.use(express.static('dist'))

app.use(cors())
app.use(express.json())
morgan.token('content', (request, response) => {
  return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1> Phonebook App</h1>')
})

app.get('/info', (request, response) => {
    let now = new Date().toDateString() + ' ' + new Date().toTimeString()
    response.send(`<p>Phonebook has info for 2 people</p><p>${now}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(404).end()
})

app.post('/api/persons', (request, response) => {
    let id = Math.floor(Math.random() * 2500)
    while (persons.find(person => person.id === id)) {
      id = Math.floor(Math.random() * 2500)
    }
    const person = request.body
    if (!('name' in person)) {
      return response.status(400).json({
        error: "The name is missing"
      })
    }
    if (!('number' in person)) {
      return response.status(400).json({
        error: "The number is missing"
      })
    }
    if (  persons.find(p => p.name === person.name)) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }
    person.id = id
    persons = persons.concat(person)
    response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
// Followed the steps in part a, but the deployment kept failing. 
// After 3 days of checking, 
// I realized that I forgot to add process.env.PORT || myport here.
const PORT = process.env.PORT || 1337
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
