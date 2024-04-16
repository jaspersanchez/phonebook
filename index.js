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

app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then((count) => {
      const page = getinfopagehtml(count, date)

      res.send(page)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then((person) => {
      res.json(person)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body
  const id = req.params.id

  const person = {
    name,
    number,
  }

  const opts = {
    new: true,
    runValidators: true,
  }

  Person.findByIdAndUpdate(id, person, opts)
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

app.post('/api/persons', (req, res, next) => {
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

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
