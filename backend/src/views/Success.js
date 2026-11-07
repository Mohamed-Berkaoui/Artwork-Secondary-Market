class SuccessRes{

    constructor(data,code){
        this.status="SUCCESS"
        this.statusCode=code  || 200
        this.data=data
    }

}


module.exports=SuccessRes