const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
// console.log(process.argv.length)
const password = process.argv[2]
const name=process.argv[3]
const number=process.argv[4]

const url =
  `mongodb+srv://irairina:${password}@jamkcluster.s0mwk.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const peopleSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', peopleSchema)

const person = new Person({
  name: name,
  number: number

})

if (process.argv.length <3) {
  console.log('give password as argument')
  process.exit(1)
}
else if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
    process.exit(1)
  })

}
else if (process.argv.length<5) {
  console.log('give name and number')
  process.exit(1)
}
else{
  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })}