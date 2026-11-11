const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Types.ObjectId, requried: true, ref: "user" },
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    year: { type: Number, min: 0, max: 2026, requried: true },
    condition: {
      type: String,
      enum: ["bad", "med", "good", "new"],
      required: true,
    },
    description: { type: String },
    price: { type: Number, required: true, min: 1 },//500
    images: [{ type: String }],
    status: {
      type: String,
      enum: ["pending", "live", "sold", "deleted"],
      default: "pending",
    },
   
  },
  { versionKey: false, timestamps: true },
);

const Listing=mongoose.model('listing',listingSchema)


module.exports=Listing