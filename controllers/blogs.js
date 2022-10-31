const express = require('express')
const router = express.Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.get('/', async (request, response, next) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1})

  response.status(200).json(blogs)
})

router.post('/', async (request, response, next) => {
  const { title, author, url, likes} = request.body

  let userId = request.body.userId
  if(!userId){
    const users = await User.find({})
    userId = users[0]._id
  } 
  const blogObj = {
    title,
    author,
    url, 
    likes,
    user: userId
  }
  const blog = new Blog(blogObj)
  const user = await User.findById(userId)
  
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  
  response.status(201).json(savedBlog)
})

router.get('/:id', async (request, response) => {
  const foundBlog = await Blog
    .findById(request.params.id)
    .populate('user', { username: 1, name: 1})
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
