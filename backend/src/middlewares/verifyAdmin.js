const User = require("../models/user.model")
const FailRes = require("../views/Fail")

async function verifyAdmin(req,res,next){
    try {
       const user=await User.findOne({_id:req.user})
       if(user.role !="admin"){
        return res.json(new FailRes('unauthorized',403))
       }
       next()
    } catch (error) {
        throw error
    }
}

module.exports=verifyAdmin