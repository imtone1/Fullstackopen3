require('dotenv').config()
const express = require('express')
const app = express()
const cors =require('cors')
var morgan = require('morgan')
const Person=require('./models/person')
app.use(express.static('build'))
app.use (cors())
app.use(express.json()) //tarvitaan post pyyntöihin

// app.use(morgan('tiny'))
morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res,next) => {
  // res.json(persons)
  Person.find({}).then(person => {
    res.json(person)
  })
    .catch(error => next(error))
})

//tietokanta
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(
      response.status(204).end()
    )
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // if (body.name === undefined) {
  //   return response.status(400).json({ error: 'name missing' })
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
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

app.get('/info', (req, res, next) => {
  var d = Date(Date.now())
  Person.find({}).then(person => {
    res.send(`<p>Phonebook has info for ${person.length} people</p><p>${d.toString()}</p>`)
  })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely, tarkoituksella kaikkien pyyntöjen jälkeen, koska tämä vastaa kaikkiin pyyntöihin
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
//virheellisten pyyntöjen käsittely
app.use(errorHandler) //tarkoituksena viimeisenä

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})