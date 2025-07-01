require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const express_session = require('express-session')
const authRouter = require('./Routes/Auth');
const { User } = require('./Model/User');
const { cookieExtractor, sanitizeUser } = require('./Common/common');

async function main(){
    await mongoose.connect(process.env.MONGODB_URI);
}
main().then(()=>{
    console.log("mongodb is connected")
}).catch((err)=>{
    console.log(err);
})

const app = express();

const SECRET_KEY = process.env.SECRET_KEY;
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY;

app.use(cors());
app.use(express.json());
app.use(express_session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.authenticate('session'));
app.use('/api',authRouter.router);

passport.use(new LocalStrategy(
    {usernameField:'email'},
    async function(email, password, done){
        const user = await User.findOne({email:email});
        if(!user) done(null,false,{message:"No user found "});
        if(user){
            crypto.pbkdf2(password,user.salt,31000,32,'sha256',async function(err,hashedPassword){
                if(!crypto.timingSafeEqual(user.password,hashedPassword)){
                    return done(null,false,{message:"Invalid Credentials"});
                }
            })
            const token = jwt.sign(sanitizeUser(user),process.env.SECRET_KEY);
            return done(null,{...user,token:token});
        }
    }
));

passport.use('jwt',new JwtStrategy(opts,async function(jwt_payload,done){
    try{
        const user = await User.findById(jwt_payload.id);
        if(user) return done(null,user);
        else return done(null,false);
    }
    catch(err){
        return done(err,false);
    }
    })
);
// this create session variable req.user on being called from callback
passport.serializeUser(function(user,cb){
    process.nextTick(function(){
        return cb(null,user);
    });
});
// this creates session variable req.user when called from authorized request
passport.deserializeUser(function(user,cb){
    process.nextTick(function(){
        return cb(null,{id:user.id});
    });
});


app.listen(process.env.PORT,()=>{
    console.log(`Server is Running on port ${process.env.PORT}`);
})
