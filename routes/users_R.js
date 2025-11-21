const express = require('express');
const router = express.Router();
const {getAll} = require("../model/users_M");
const {isValidid , valuesToEdit} = require('../middelware/users_MID.js');
const { getAllUsers ,getOneUser,deleteUser,updateUser } = require("../controller/users_C");

router.get('/', getAllUsers);

router.get('/:id', isValidid, getOneUser);


router.delete('/:id', isValidid, deleteUser);


router.patch('/:id',isValidid,valuesToEdit,updateUser);


module.exports = router;
