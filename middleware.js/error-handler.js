const { customErrorHandler } = require("../errors/custom-error");
const errorHandlerMidlleware = (err,req,res,next)=>{
    if(err instanceof customErrorHandler){
        res.status(err.statusCode).json({msg:err.message})
    }
    res.status(500).json( {msg:"something wrong ,pleas try again"});
}

module.exports = errorHandlerMidlleware;