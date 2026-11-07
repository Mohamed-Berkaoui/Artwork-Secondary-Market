const asyncHandler = require('../config/asyncHandler')
const { register, login, getMe } = require('../controllers/user.controllers')
const verifyToken = require('../middlewares/verifyToken')

const userRouter=require('express').Router()



userRouter.post('/register',asyncHandler(register))

userRouter.post('/login',asyncHandler(login))

userRouter.get('/me',asyncHandler(verifyToken),asyncHandler(getMe))

module.exports=userRouter