function isValidid(req,res,next){
    let id = parseInt(req.params.id) ;
    if (isNaN(id)|| id<=0 ){
        res.status(400).json({message: "id is not a valid id"});
        return;
    }
    req.params.id = id;
    next();
}

function valuesToEdit(req,res,next){
    let obj = {};
   if(req.body.name){
       obj.name = req.body.name;
   }
    if(req.body.email){
        obj.email = req.body.email;
    }
    if(req.body.username){
        obj.username = req.body.username;
    }

    let keys = Object.keys(obj);
    if(keys.length === 0){
        res.status(400).json({message: "חסרים פרטמרים"});
    }
    req.user = obj;
    next();
}



module.exports = {
     isValidid,
    valuesToEdit
 };