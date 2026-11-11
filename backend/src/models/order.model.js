const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  listing: { type: mongoose.Types.ObjectId, ref: "listing", unique: true },
  buyer: { type: mongoose.Types.ObjectId, ref: "user" },
  seller: { type: mongoose.Types.ObjectId, ref: "user" },
  price: { type: Number, required: true },
  paid: { type: Boolean, default: false },
});


const Order=mongoose.model('order',orderSchema)


module.exports=Order