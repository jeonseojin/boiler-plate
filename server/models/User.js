const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;// salt를 이용해서 비밀번호를 암호화하며 saltRouds의 갯수를 참고하여 생성
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        uique:1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

//mongoose에서 가져온 methods
userSchema.pre('save', function( next ){
    var user = this;

    if (user.isModified('password')){
        //비밀번호를 암호화 시킨다.
        // index.js에서 user.save를 하기 전에 이루어 지는 코드
        bcrypt.genSalt(saltRounds, function(err, salt){
            if (err) return next(err)
            bcrypt.hash(user.password/* 입력받은 비밀번호 */, salt, function(err, hash/* 암호화된 비밀번호 */) {
                if (err) return next(err)
                user.password =hash
                next()
            })
        })
    } else { //  비밀번호가 아닌다 다른 것을 변경할 때 빠져나갈 수 있는 코드
        next()
    }
})

// 로그인
userSchema.methods.comparePassword = function(plainPassword, cb){
    //비밀번호 비교 plainPassword -> test123 / 암호화 $2b$10$C6hr9ZwKXzvPuhNJ4qCfw.8wzZXuAr3J66reSBymSvTpGLVnKDKQ.
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    // jsonwebtoken을 이용해서 token을 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken')// user._id + secretToken = token
    user.token = token
    user.save(function(err, user) {
        if (err) return cb(err)
        cb(null, user)
    })

}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    //token 을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음 
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({ "_id": decoded, "token": token}, function(err, user) {
            if (err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }