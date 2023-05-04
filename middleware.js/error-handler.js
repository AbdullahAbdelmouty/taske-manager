const errorHandlerMidlleware = (err,req,res,next)=>{
    res.status(500).json( {msg:"something wrong ,pleas try again"});
}

module.exports = errorHandlerMidlleware;