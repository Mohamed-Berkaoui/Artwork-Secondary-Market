const Listing = require("../models/listing.model");
const FailRes = require("../views/Fail");
const SuccessRes = require("../views/Success");

async function getListings(req, res) {
  const { q, minPrice, maxPrice, page } = req.query;

  const LISTINGSPERPAGE = 10;
  const listings = await Listing.find({
    status: "live",
    title: { $regex: q || "", $options: "i" },
  })
    .limit(LISTINGSPERPAGE)
    .skip(page * LISTINGSPERPAGE);

  res.json(new SuccessRes(listings));
}

async function getListingById(req, res) {
  const id = req.params.id;

  const listing = await Listing.findOne({ _id: id, status: "live" });
  if (!listing) {
    return res.json(new FailRes("liting not found"));
  }
  res.json(new SuccessRes(listing));
}

async function createNewListing(req, res) {
  const { title, artist, year, condition, description, price } = req.body;

  if (!title || !artist || !year || !price || !condition) {
    return res.json(
      new FailRes("title,year,artist,price and condition required"),
    );
  }

  const newListing = await Listing.insertOne({
    title,
    artist,
    year,
    condition,
    description,
    price,
    seller: req.user,
  });
  res.json(new SuccessRes(newListing));
}

async function getMyListings(req, res) {
  const userListings =await  Listing.find({ seller: req.user,status:{$ne:"deleted"} });

  res.json(new SuccessRes(userListings));
}

async function deleteListing(req,res){

    const deletedListing= await Listing.updateOne({seller:req.user,_id:req.params.id},{status:"deleted"})

    if(!deletedListing.modifiedCount){
        return res.json(new FailRes("listing not found"))
    }
    res.json(new SuccessRes("listing deleted"))

}


async function getPendingListings(req,res){
  const pendingListings=await Listing.find({status:"pending"})
  res.json(new SuccessRes(pendingListings))
}


async function updateListingsStatus(req,res){
  const id=req.params.id
  const updatedListing=await Listing.updateOne({_id:id},{$set:{status:req.body.status}})
  res.json(new SuccessRes(updatedListing))
}
module.exports = { getListings, getListingById, createNewListing ,getMyListings,deleteListing,getPendingListings,updateListingsStatus};
