const config = require('config') 
const express = require('express') 
const { MongoClient } = require('mongodb')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const HOST = config.get('server.host')
const PORT = config.get('server.port')
const URI = config.get('mongodb.uri')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json('Hello to my app!')
})

app.post('/signup', async (req, res) => {
  const client = new MongoClient(URI)
  // console.log(req.body)
  const { email, password } = req.body
  const generatedUserId = uuidv4()
  const hashedPassword = await bcrypt.hash(password, 10)

  // Send over to database
  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')
    const existingUser = await users.findOne({ email })

    if (existingUser) {
      return res.status(409).send('User already exists! Please login.')
    }

    const sanitizedEmail = email.toLowerCase()

    const data = {
      user_id: generatedUserId,
      email: sanitizedEmail,
      hashed_password: hashedPassword
    }
    const insertedUser = await users.insertOne(data)

    const token = jwt.sign(insertedUser, sanitizedEmail, {
      expiresIn: 60 * 48, // Expires in 48hrs
    })

    res.status(201).json({ token, userId: generatedUserId, email: sanitizedEmail })
    
  } catch (err) {
    console.log(err)
  }

})

app.get('/users', async (req, res) => {
  const client = new MongoClient(URI)

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const returnedUsers = await users.find().toArray()
    res.send(returnedUsers)
  } finally {
    await client.close()
  }
})


app.listen(PORT, () => console.log('Server running on PORT ' + PORT))