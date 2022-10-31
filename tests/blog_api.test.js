const app = require('../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const api = supertest(app)
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./testHelper')


describe('testing the blog api', () => {

beforeEach( async () => {
  await Blog.deleteMany({}) 
  const blogObjects = helper.blogs.map(b => new Blog(b))
  const promiseArray = blogObjects.map(blog => blog.save())
  
  await Promise.all(promiseArray)
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({
    username: 'root',
    name: 'admin',
    passwordHash
  })
  
  await user.save()
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

test('a valid blog with a valid token can be added', async () => {
  
  const newBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  }
  const authHeader = await helper.getAuthHeader()
  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', authHeader)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const allBlogs = await helper.blogsInDb()
  expect(allBlogs).toHaveLength(helper.blogs.length + 1)
})
test('a blog without a valid token fails with a proper status code(401 unauthorized)', async () => {
  const blog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  }
  const blogsAtStart = await helper.blogsInDb()

  await api
    .post('/api/blogs')
    .send(blog)
    .expect(401)
  
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtStart).toEqual(blogsAtEnd)
})

test('a blog without likes property gets 0 as default value', async () => {
  const newBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  }
  const response = await api
    .post('/api/blogs')
    .set('Authorization', await helper.getAuthHeader())
    .send(newBlog)
    .expect(201)
  const addedBlog = response.body

  expect(addedBlog.likes).toBe(0)
})

test('adding a blog without a title or url are responds with the correct status code(400)', async () => {
  const blog = {
    title: 'Something',
    author: 'John Dross'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', await helper.getAuthHeader())
    .send(blog)
    .expect(400)

  const anotherBlog = {
    author: 'John Sterling',
    likes: 14,
    url: 'https://www.google.com/ncr'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', await helper.getAuthHeader())
    .send(anotherBlog)
    .expect(400)

})

test('updating a blog', async () => {
  const blogsAtStart = await helper.blogsInDb()
  
  const blogToUpdate = blogsAtStart[0]

  const blog = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: blogToUpdate.likes + 5
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blog)
    .expect(200)
    .expect('Content-Type',/application\/json/)
  const updatedBlog = {
    ...response.body
  }
 
  expect(updatedBlog.likes).toBe(blogToUpdate.likes + 5)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.blogs.length)
})

test('deleting a blog with a given id', async () => {
  const blogObj = {
    title: 'This will be deleted',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  }
  const response = await api
  .post('/api/blogs')
  .send(blogObj)
  .set('Authorization', await helper.getAuthHeader())
  .expect(201)
    .expect('Content-Type', /application\/json/)
    
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = response.body
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', await helper.getAuthHeader())
    .expect(204)
  
  const blogsAtEnd = await helper.blogsInDb()
  console.log(blogsAtEnd)
  const contents = blogsAtEnd.map(blog => blog.title)

  expect(contents).not.toContain(blogToDelete.title)
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1 )
})

afterAll(() => {
  mongoose.connection.close()
})
  
})