const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } =require('./models/User');
const config = require('./config/key');
const cookieParser = require('cookie-parser');




//body-parser에 옵션주기
app.use(bodyParser.urlencoded({ extended: true }));//application/x-www-urlencoded를 파악해서 가져옴
app.use(bodyParser.json());//application/json을 파악해서 가져옴
app.use(cookieParser());


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

    // 로그인
    app.post('/login', (req, res) => {
        // 데이터베이스에서 요청된 email 찾기
        User.findOne({ email: req.body.email }, (err, user) => {
            if (!user) {
                return res.json({
                    loginSuccess: false,
                    messsage: "제공된 이메일에 해당하는 유저가 없습니다."
                })
            }
        // 요청된 이메일이 있다면 입력된 비밀번호가 같은지 확인
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (!isMatch)
                    return res.json({ loginSuccess: false, messsage: "비밀번호가 틀렸습니다." })

        // 비밀번호까지 맞다면 토큰 생성하기
                user.generateToken((err, user) => {
                    if (err) return res.status(400).send(err);

                    //token을 저장함(쿠기, 로컬스토리지 등에 저장)
                    res.cookie('x_auth', user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id})
                })
            })
        })
    })

app.listen(port, () => {  console.log(`Example app listening at http://localhost:${port}`)})

