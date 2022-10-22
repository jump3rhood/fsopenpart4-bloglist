const express = require('express')
const router = express.Router()
const Blog = require('../models/blog')

router.get('/', async (request, response, next) => {
  const blogs = await Blog.find({})

  response.status(200).json(blogs)
})

router.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)
  
  const savedBlog = await blog.save()
  if(savedBlog)
    response.status(201).json(savedBlog)
  else
    response.status(400).end()
})

router.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)

  response.status(204).end()
})
module.exports = router
