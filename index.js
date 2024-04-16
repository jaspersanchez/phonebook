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

const date = new Date()

const getinfopagehtml = (personcount, date) => {
  return `
    <p>phonebook has info for ${personcount} people </p>
    <p>${date}</p>
`
}

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((people) => res.json(people))
    .catch((error) => next(error))
})

app.get('/info', (req, res) => {
  const page = getinfopagehtml(persons.length, date)
  res.send(page)
})

app.get('/api/persons/:id', (req, res) => {
  console.log('find person', req.params.id)
  const id = Number(req.params.id)
  const person = persons.find((p) => p.id === id)
  if (person) return res.json(person)

  return res.status(404).end()
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const { name, number } = req.body

  const person = {
    name,
    number,
  }

  Person.findByIdAndUpdate(id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end()
    })
    .catch((error) => next(error))
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

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson)
    })
    .catch((error) => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
