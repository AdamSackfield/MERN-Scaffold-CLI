// Dependencies
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan')

// Files


// Initialize Server and Port
const Server = express()
const PORT = process.env.PORT || 4000

// Database Connection
mongoose.connect(process.env.DB_HOST)
mongoose.connection.on('error', (err) => {
  console.log('MongoDB connection error', err)
})
mongoose.connection.on('connected', () => {
  console.log(`Connected to DB: ${process.env.DB_HOST}`)
})

// Middleware
Server.use(cors())
Server.use(logger('tiny'))
Server.use(bodyParser.json())

// Start the Server
Server.listen(PORT, (err) => {
  if(err) { console.log(err) }
    console.log(`Server running on Port ${PORT}`)
})