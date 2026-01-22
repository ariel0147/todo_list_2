
const { getAll, getOne, deleteUserFromDB,update} = require('../model/users_M.js');


async function getAllUsers(req,res){
    try {
        let users = await getAll();
        if(users.length === 0){
            return res.status(400).json({ message: "No users found." });
        }
        res.status(200).json({ message: "ok", users });
    } catch(err){
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

async function getOneUser(req,res){
    try{
        let user = await getOne(req.params.id);
        if(!user){
            return res.status(400).json({ message: `No user found with id ${req.params.id}` });
        }
        res.status(200).json({ message: "ok", user });
    } catch(err){
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

async function deleteUser(req, res) {
    try {
        const id = req.params.id;
        const result = await deleteUserFromDB(id);

        if (!result || result.affectedRows === 0) {
            return res.status(404).json({ message: `No user found with id ${id}` });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

async function updateUser(req,res) {
    try{

        let affectedRows = await update(req.params.id, req.user);

        if(!affectedRows){
            return res.status(400).json({message:`User ${req.params.id} not found!`})
        }
        res.status(200).json({message:"updated!"});
    }catch(err){
        res.status(500).json({message:"Server error"})
    }
}

module.exports = { getAllUsers, getOneUser, deleteUser,updateUser };
