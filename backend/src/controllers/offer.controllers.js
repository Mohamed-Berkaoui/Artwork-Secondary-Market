const Listing = require("../models/listing.model")
const Offer = require("../models/offer.model")
const FailRes = require("../views/Fail")
const SuccessRes = require("../views/Success")

async function createOffer(req,res){
    const listingId=req.params.id
    const listing=await Listing.findOne({_id:listingId})
    if(!listing){
        return res.json(new FailRes("listing not found"))
    }
    if(listing.seller==req.user){
        return res.json(new FailRes("cannot send offer"))
    }

    const amount =req.body.amount
    const newOffer=await Offer.insertOne({
        listing:listingId,
        buyer:req.user,
        amount:amount
    })
    res.json(new SuccessRes(newOffer))
}


module.exports={createOffer}