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
let  persons=[
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": 1
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": 2
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": 3
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": 4
    }
  ]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  // res.json(persons)
  Person.find({}).then(person => {
    res.json(person)
  })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

  // app.delete('/api/persons/:id', (request, response) => {
  //   const id = Number(request.params.id)
  //   persons = persons.filter(person => person.id !== id)
  
  //   response.status(204).end()
  // })

  // const generateId = () => {
  //   const randId = persons.length > 0
  //     ? Math.floor(Math.random() * 10000)
  //     : 0
  //   const person = persons.find(person => person.id === randId)
  //   // console.log("random id",randId)
  //   // console.log("person",person)
    
  //   return randId
  // }

  //tietokanta
  app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
  })
  
  // app.post('/api/persons', (request, response) => {
  //   const body = request.body
  //   // console.log(persons)
  //   const personName = persons.find(person => person.name === body.name)
  //   // console.log("personName", personName)
  //   if (!body.name || !body.number) {
  //     return response.status(400).json({ 
  //       error: 'name or number is missing' 
  //     })
  //   }
  //   else if (body.name==="" || body.number===""){
  //     return response.status(400).json({ 
  //       error: 'name or number is missing' 
  //     })
  //   }
  //   else if(persons.find(person => person.name === body.name)){
  //     return response.status(406).json({ 
  //       error: 'name must be unique' 
  //     })
  //   }else{
  //     // console.log(body)
    
  //   const postPerson = {
  //     name: body.name,
  //     number: body.number,
  //     id: generateId(),
  //   }
  // // console.log("postperson", postPerson)
  //   persons = persons.concat(postPerson)
  
  //   response.json(postPerson)
  //   }
    
  // })

  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (body.name === undefined) {
      return response.status(400).json({ error: 'name missing' })
    }
  
    const person = new Person({
      name: body.name,
      number: body.number
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })

app.get('/info', (req, res) => {
  var d = Date(Date.now());
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${d.toString()}</p>`)
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
    }
  
    next(error)
  }
//virheellisten pyyntöjen käsittely
app.use(errorHandler) //tarkoituksena viimeisenä

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})