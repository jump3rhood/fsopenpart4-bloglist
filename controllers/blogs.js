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

router.get('/:id', async (request, response) => {
  const foundBlog = await Blog.findById(request.params.id)
  if(foundBlog)
    response.status(200).json(foundBlog)
  else
    response.status(400).end()
})

router.put('/:id', async (request, response) => {
  const body = request.body 

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new:true})
  response.json(updatedBlog)
})
router.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)

  response.status(204).end()
})
module.exports = router
