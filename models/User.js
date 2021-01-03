const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;// salt를 이용해서 비밀번호를 암호화하며 saltRouds의 갯수를 참고하여 생성

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
    }
    
})

const User = mongoose.model('User', userSchema)

module.exports = { User }