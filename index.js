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

const getInfoPageHtml = (personCount, date) => {
  return `
    <p>Phonebook has info for ${personCount} people </p>
    <p>${date}</p>
`
}

const generateId = () => Math.floor(Math.random() * 1000000000000)

app.get('/api/persons', (req, res) => {
  Person.find({}).then((people) => res.json(people))
})

app.get('/info', (req, res) => {
  const page = getInfoPageHtml(persons.length, date)
  res.send(page)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find((p) => p.id === id)
  if (person) return res.json(person)

  return res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter((p) => p.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body
  const id = generateId()

  if (!name || !number)
    return res.status(400).json({
      error: 'name or number missing',
    })

  const personExist = persons.find((p) => p.name === name)

  if (personExist)
    return res.status(400).json({
      error: 'name must be unique',
    })

  const person = {
    id,
    name,
    number,
  }

  persons = persons.concat(person)

  return res.json(person)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
