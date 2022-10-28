const app = require('../app')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const api = supertest(app)
const helper = require('./testHelper')
const User = require('../models/user')
describe('when there is initially one user in db', () => {
  beforeEach( async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
      username: 'root',
      name: 'admin',
      passwordHash
    })
    
    await user.save()
  })

  test('creation succeeds with one fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'scammer',
      name: 'Peter',
      password: 'scamsalot'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)

  })
  test('creation fails with proper statuscode and message if the username is taken', async()=> {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
  test('creation fails with proper statuscode and message if username or password is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'ab',
      name:'whatever',
      password: 'password'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const anotherUser = {
      username: 'abc',
      name: 'somename',
      password: 'ab'
    }

    const result = await api
      .post('/api/users')
      .send(anotherUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    expect(result.body.error).toBe('password must be 3 characters or longer')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
  afterAll(() => {
    mongoose.connection.close()
  })
})