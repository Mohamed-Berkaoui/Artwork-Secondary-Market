class ErrorRes {

    constructor(message,code){
        this.status="ERROR"
        this.statusCode=code || 500
        this.message=message
    }

}


module.exports=ErrorRes