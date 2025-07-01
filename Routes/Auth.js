const express = require('express');
const { createUser, loginUser, checkAuth } = require('../Controller/Auth');
const passport = require('passport');
const router = express.Router();

router.post('/auth/signup',createUser)
    .post('/auth/signin',passport.authenticate('local'),loginUser)
    .get('/auth/check',passport.authenticate('jwt'),checkAuth)

exports.router = router;