// controller/users_C.js
const { getAll, getOne, deleteUserFromDB } = require('../model/users_M.js');

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

module.exports = { getAllUsers, getOneUser, deleteUser };
