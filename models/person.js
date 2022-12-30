const mongoose = require('mongoose')
//for mongoose 7 
mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI

// console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const peopleSchema = new mongoose.Schema({
    name: {type: String,
    minlength: 3,
  required: true},
    number: {type: String,
    required: true},
  })

peopleSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', peopleSchema)