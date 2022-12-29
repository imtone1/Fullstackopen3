const express = require('express')
const app = express()
const cors =require('cors')
var morgan = require('morgan')
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
  res.json(persons)
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

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  const generateId = () => {
    const randId = persons.length > 0
      ? Math.floor(Math.random() * 10000)
      : 0
    const person = persons.find(person => person.id === randId)
    // console.log("random id",randId)
    // console.log("person",person)
    
    return randId
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
    // console.log(persons)
    const personName = persons.find(person => person.name === body.name)
    // console.log("personName", personName)
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name or number is missing' 
      })
    }
    else if (body.name==="" || body.number===""){
      return response.status(400).json({ 
        error: 'name or number is missing' 
      })
    }
    else if(persons.find(person => person.name === body.name)){
      return response.status(406).json({ 
        error: 'name must be unique' 
      })
    }else{
      // console.log(body)
    
    const postPerson = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  // console.log("postperson", postPerson)
    persons = persons.concat(postPerson)
  
    response.json(postPerson)
    }
    
  })

app.get('/info', (req, res) => {
  var d = Date(Date.now());
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${d.toString()}</p>`)
  })

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})