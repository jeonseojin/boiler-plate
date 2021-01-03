const express = require('express')
const app = express()
const port = 5000

//mongoDB 연결
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))


app.get('/', (req, res) => {  res.send('Hello World!') })

app.listen(port, () => {  console.log(`Example app listening at http://localhost:${port}`)})

