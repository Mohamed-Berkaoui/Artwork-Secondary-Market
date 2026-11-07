class FailRes{

    constructor(message,code){
        this.status="FAIL"
        this.statusCode=code || 400
        this.message=message
    }

}


module.exports=FailRes