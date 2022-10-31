const express = require('express')
const jwt = require('jsonwebtoken')
const blogsRouter = express.Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1})

  response.status(200).json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!decodedToken){
    return response.status(401).json({error: 'token missing or invalid'})
  }
  const user = await User.findById(decodedToken.id)

  const blogObj = {
    title : body.title,
    author: body.author,
    url: body.url, 
    likes: body.likes,
    user: user._id
  }
  const blog = new Blog(blogObj)
  
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  
  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const foundBlog = await Blog
    .findById(request.params.id)
    .populate('user', { username: 1, name: 1})
  if(foundBlog)
    response.status(200).json(foundBlog)
  else
    response.status(400).end()
})

blogsRouter.put('/:id', async (request, response) => {
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
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)

  response.status(204).end()
})
module.exports = blogsRouter
