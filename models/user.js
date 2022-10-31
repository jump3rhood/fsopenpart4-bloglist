const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    minLength: 8,
    required: true
  },
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id 
    delete returnedObj.__v
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User