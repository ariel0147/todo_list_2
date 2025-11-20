function isValidid(req,res,next){
    let id = parseInt(req.params.id) ;
    if (isNaN(id)|| id<=0 ){
        res.status(400).json({message: "id is not a valid id"});
        return;
    }
    req.params.id = id;
    next();
}



 module.exports = {
     isValidid
 };