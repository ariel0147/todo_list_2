
const { getAll} = require('../model/categories_M.js');
const {getBycategoriesName, addUser} = require("../model/users_M");



async function getAllcategories(req,res){
    try {
        let categories = await getAll();
        if(categories.length === 0){
            return res.status(400).json({ message: "אין נתונים בקטגוריות." });
        }
        res.status(200).json({ message: "ok", categories });
    } catch(err){
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

async function addcategories(req,res) {
    try{
        let name = req.body.name;
        let categories = await getBycategoriesName(categories);
        if(categories){
            return res.status(409).json({message:"שם קטגוריה קיים במערכת"});
        }

        res.status(201).json({message:"נוסף בהצלחה"});
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Server error"});
    }
}

let categorid = await add({name,categorid});
if(!categorid){
    return res.status(500).json({message:"Server error"});
}
module.exports = { getAllcategories,addcategories};
