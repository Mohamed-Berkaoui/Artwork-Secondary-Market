const express=require('express')
const userRouter = require("./routes/user.routes")
const listingRouter = require('./routes/listing.routes')
const offerRouter = require('./routes/offer.routes')



const app=express()
app.use(express.json())

app.use('/api/v1/user',userRouter)

app.use('/api/v1/listing',listingRouter)

app.use("/api/v1/offer",offerRouter)

module.exports=app


