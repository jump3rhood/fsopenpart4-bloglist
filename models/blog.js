const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 4,
    required: true
  },
  author: {
    type: String, 
    required: true
  },
  url: {
    type:String,
    required: true
  },
  likes: {
    type: Number, 
    default: 0
  }
})

blogSchema.set('toJSON', {
  transform: (doc, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)
