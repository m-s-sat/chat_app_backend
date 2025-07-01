const express = require('express');
const { createUser, loginUser } = require('../Controller/Auth');
const passport = require('passport');
const router = express.Router();

router.post('/auth/signup',createUser)
    .post('/auth/signin',passport.authenticate('local'),loginUser)

exports.router = router;