const asyncHandler = require('../config/asyncHandler')
const { createOffer, getReceivedOffers, getMyOffers, acceptOrDeclineOffer, buyListingWithItsPrice } = require('../controllers/offer.controllers')
const verifyToken = require('../middlewares/verifyToken')

const offerRouter=require('express').Router()


offerRouter.post("/listing/:listingId",asyncHandler(verifyToken),asyncHandler(createOffer))

offerRouter.get('/received',asyncHandler(verifyToken),asyncHandler(getReceivedOffers))



/**
 * @todo postman test
 */


offerRouter.get('/sent',asyncHandler(verifyToken),asyncHandler(getMyOffers))
offerRouter.patch('/:id',asyncHandler(verifyToken),asyncHandler(acceptOrDeclineOffer))
offerRouter.post('/:listingId/buy',asyncHandler(verifyToken),asyncHandler(buyListingWithItsPrice))


module.exports=offerRouter