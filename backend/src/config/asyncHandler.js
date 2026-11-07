const ErrorRes = require("../views/Error")

 function asyncHandler(fn){
    return async function(req,res,next){
        try {
            await fn(req,res,next)

        } catch (error) {
            res.json(new ErrorRes(error.message,500))
        }
    }

}

module.exports=asyncHandler