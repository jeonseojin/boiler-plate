const { User } = require('../models/User');
let auth = (req, res, next) => {

    //  인증 처리를 하는 곳(처리 순서)
    //  클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;
    //  토큰을 복호화 한 후 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true })

        //req를 받을 때 index에서 값을 사용할 수 있게 하기 위해서 크도 작성
        req.token = token;
        req.user = user;
        next();// middleware에 갈 수 있도록 next를 사용
    })
    //  유저가 있으면 인증 ok
    //  유저가 없으면 인증 no

}

module.exports = { auth };