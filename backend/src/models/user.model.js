const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    ratingCount: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true },
);


const User=mongoose.model('user',userSchema)



module.exports=User