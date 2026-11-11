const Listing = require("../models/listing.model");
const Offer = require("../models/offer.model");
const Order = require("../models/order.model");
const FailRes = require("../views/Fail");
const SuccessRes = require("../views/Success");

async function createOffer(req, res) {
  const listingId = req.params.listingId;
  const listing = await Listing.findOne({ _id: listingId, status: "live" });
  if (!listing) {
    return res.json(new FailRes("listing not found"));
  }
  if (listing.seller == req.user) {
    return res.json(new FailRes("cannot send offer"));
  }

  const amount = req.body.amount;
  const newOffer = await Offer.insertOne({
    listing: listingId,
    buyer: req.user,
    amount: amount,
  });
  res.json(new SuccessRes(newOffer));
}

async function getReceivedOffers(req, res) {
  const userListing = await Listing.find({ seller: req.user, status: "live" });
  console.log("🚀 ~ getReceivedOffers ~ userListing:", userListing);

  if (!userListing.length) {
    return res.json(new FailRes("no listings found"));
  }
  let userOffers = [];
  for (let i = 0; i < userListing.length; i++) {
    const listingOffers = await Offer.find({ listing: userListing[i]._id });
    userOffers = [...userOffers, ...listingOffers];
  }
  res.json(new SuccessRes(userOffers));
}

async function getMyOffers(req, res) {
  const myOffers = await Offer.find({ buyer: req.user }).populate("listing");

  res.json(new SuccessRes(myOffers));
}

async function acceptOrDeclineOffer(req, res) {
  const offerId = req.params.id;
  const offer = await Offer.findById(offerId).populate("listing");
  if (offer.listing.seller != req.user) {
    return res.json(new FailRes("listing must be your's"));
  }

  if (offer.listing.status != "live") {
    return res.json(new FailRes("listing sold"));
  }
  const newStatus = req.body.status;
  await Offer.findByIdAndUpdate(offerId, { status: newStatus });
  if (newStatus == "accepted") {
    await Listing.findByIdAndUpdate(offer.listing._id, { status: "sold" });
    const order = await Order.insertOne({
      buyer: offer.buyer,
      seller: offer.seller,
      listing: offer.listing._id,
      price: offer.amount,
    });
  }
  res.json(new SuccessRes(order));
}

async function buyListingWithItsPrice(req, res) {
  const listingId = req.params.listingId;
  const listing = await Listing.findOne({ _id: listingId, status: "live" });
  if (!listing) {
    return res.json(new FailRes("listing not found"));
  }
  if (listing.seller == req.user) {
    return res.json(new FailRes("cannot send offer"));
  }

  listing.status = "sold";
  await listing.save();
  const order = await Order.insertOne({
    buyer: req.user,
    seller: listing.seller,
    listing: listing._id,
    price: listing.price,
  });

  res.json(new SuccesRes(order));
}
module.exports = {
  createOffer,
  getReceivedOffers,
  getMyOffers,
  acceptOrDeclineOffer,
  buyListingWithItsPrice
};
