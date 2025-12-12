const express = require('express');
const router = express.Router();
const {getAll} = require("../model/users_M");
const {isValidid , valuesToEdit} = require('../middelware/users_MID.js');
const { getAllUsers ,getOneUser,deleteUser,updateUser } = require("../controller/users_C");
const {isLoggedIn} = require("../middelware/auth_MID");

router.get('/', isLoggedIn,getAllUsers);
router.get('/:id', isValidid, getOneUser);
router.delete('/:id', isLoggedIn,isValidid, deleteUser);
router.patch('/:id',isLoggedIn,isValidid,valuesToEdit,updateUser);




module.exports = router;
