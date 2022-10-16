const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const blogsRouter = require('./controllers/blogs');
  
const mongoUrl = 'mongodb+srv://fullstack:fullstack@cluster0.y4uxh.mongodb.net/blogs?retryWrites=true&w=majority'
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter);
 
module.exports = app;