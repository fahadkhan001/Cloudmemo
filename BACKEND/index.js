const connectToMongoose = require('./db')
const express = require('express')
const cors = require('cors')  

connectToMongoose();
const app = express()
const port = 5000

 
app.use(cors())
app.use(express.json())

// Available routes
app.use('/api/auth', require('./routes/auth.js'))
app.use('/api/notes', require('./routes/notes'))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Cloud Memo backend listening at  port http://127.0.0.1:${port}`)
})
