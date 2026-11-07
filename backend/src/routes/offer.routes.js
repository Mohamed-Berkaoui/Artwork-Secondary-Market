const asyncHandler = require('../config/asyncHandler')
const { createOffer } = require('../controllers/offer.controllers')
const verifyToken = require('../middlewares/verifyToken')

const offerRouter=require('express').Router()


offerRouter.post("/listing/:id",asyncHandler(verifyToken),asyncHandler(createOffer))