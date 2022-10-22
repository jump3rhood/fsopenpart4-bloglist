const app = require('../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./testHelper')

beforeEach( async () => {
  await Blog.deleteMany({}) 
  const blogObjects = helper.blogs.map(b => new Blog(b))
  const promiseArray = blogObjects.map(blog => blog.save())

  await Promise.all(promiseArray)
})

test('Bloglist application returns the correct amount of blogs in the correct format', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    
    expect(response.body).toHaveLength(helper.blogs.length)
})
test('blogs contain a unique identifier property named id', async () => {
  const response = await api.get('/api/blogs')
  const blogToCheck = response.body[0]

  expect(blogToCheck.id).toBeDefined()
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const allBlogs = await helper.blogsInDb()
  expect(allBlogs).toHaveLength(helper.blogs.length + 1)
})

test('a blog without likes property gets 0 as default value', async () => {
  const newBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  }
  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
  const addedBlog = response.body
  expect(addedBlog.likes).toBe(0)

})
afterAll(() => {
  mongoose.connection.close()
})