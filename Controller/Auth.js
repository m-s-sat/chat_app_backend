const { User } = require("../Model/User");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { sanitizeUser } = require("../Common/common");

exports.createUser = (req,res)=>{
    try{
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(req.body.password,salt,31000,32,'sha256',async function(err,hashedPassword){
            const user = new User({...req.body,password:hashedPassword,salt:salt});
            const doc = await user.save();
            req.login(doc,(err)=>{
                if(err) res.status(400).json(err);
                else{
                    const token =  jwt.sign(sanitizeUser(doc),process.env.SECRET_KEY);
                    res.cookie('jwt',token,{expires:new Date(Date.now()+3600000),httpOnly:true}).status(200).json(req.user);
                }
            })
        })
    }
    catch(err){
        res.status(400).json(err);
    }
}

exports.loginUser = (req,res)=>{
    try{
        res.cookie('jwt',req.user.token,{expires: new Date(Date.now()+3600000),httpOnly:true}).json(req.user);
    }
    catch(err){
        res.status(400).json(err)
    }
}

exports.checkAuth = (req,res)=>{
    if(req.user) res.json(req.user);
    else res.status(401);
}