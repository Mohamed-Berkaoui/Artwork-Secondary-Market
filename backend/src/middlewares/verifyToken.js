
const jwt =require("jsonwebtoken")
async function verifyToken(req,res,next){
    const token=req.headers.Authorization || req.headers.authorization
    try {
        const decode=jwt.verify(token,process.env.JWTPASS)
        req.user=decode.id
        next()
    } catch (error) {
        throw error
    }
}

module.exports=verifyToken