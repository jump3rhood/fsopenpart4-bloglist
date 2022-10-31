const jwt = require('jsonwebtoken')
const User = require('../models/user')
const logger = require('./logger')


const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer ')){
    const token = authorization.substring(7)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    console.log(user)
    request.user = user
  }
  next()
}
const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}


module.exports = {
  unknownEndPoint, errorHandler, userExtractor
}