const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } =require('./models/User');
const config = require('./config/key');




//body-parser에 옵션주기
app.use(bodyParser.urlencoded({ extended: true }));//application/x-www-urlencoded를 파악해서 가져옴
app.use(bodyParser.json());//application/json을 파악해서 가져옴


//mongoDB 연결
const mongoose = require('mongoose')
mongoose.connect( config.mongoURI , {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))


app.get('/', (req, res) => {  res.send('Hello World! 안녕~') })

app.post('/register', (req, res) => {


    
    // 회원가입할 때 필요한 정보들을 클라이언트에서 자겨오면
    // 그것들을 데이터베이스에 넣어준다

    // 인스턴스 생성
    const user = new User(req.body)//req.body 안에 json 형식의 id / password 등이 들어있음

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err})
            return res.status(200).json({
                successs: true
            })
        })
    })

app.listen(port, () => {  console.log(`Example app listening at http://localhost:${port}`)})

