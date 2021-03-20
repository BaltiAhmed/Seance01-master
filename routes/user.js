const express = require('express');
const route = express.Router();

const userControllers = require('../controllers/user')

const {check} = require('express-validator')

route.get('/getUser',userControllers.getUser)

route.post('/signup', 
check('name')
.not()
.isEmpty(),
check('email')
.normalizeEmail(),
check('password')
.isLength({min:8})
, userControllers.signup)

route.patch('/:userId', 
check('name')
.not()
.isEmpty(),
check('email')
.normalizeEmail(),
check('password')
.isLength({min:8})
, userControllers.updateUser)

route.delete('/:id',userControllers.deleteUser)

route.post('/login',
check('name')
.not()
.isEmpty(),
check('email')
.normalizeEmail()
,userControllers.login)



module.exports = route
