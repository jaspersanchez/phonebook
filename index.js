require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/people.js')

morgan.token('request-body', (req, res) => JSON.stringify(req.body))

app.use(express.static('dist'))
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :request-body',
  ),
)
app.use(express.json())

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

const date = new Date()

const getinfopagehtml = (personcount, date) => {
  return `
    <p>phonebook has info for ${personcount} people </p>
    <p>${date}</p>
`
}

const generateid = () => math.floor(math.random() * 1000000000000)

app.get('/api/persons', (req, res) => {
  Person.find({}).then((people) => res.json(people))
})

app.get('/info', (req, res) => {
  const page = getinfopagehtml(persons.length, date)
  res.send(page)
})

app.get('/api/persons/:id', (req, res) => {
  const id = number(req.params.id)
  const person = persons.find((p) => p.id === id)
  if (person) return res.json(person)

  return res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
  const id = number(req.params.id)
  persons = persons.filter((p) => p.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body

  if (!name || !number)
    return res.status(400).json({
      error: 'name or number missing',
    })

  const person = new Person({
    name,
    number,
  })

  person.save().then((savedPerson) => {
    res.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
