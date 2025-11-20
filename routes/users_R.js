const express = require('express');
const router = express.Router();
const  {getAllUsers} = require('../controller/users_C.js');
const {getAll} = require("../model/users_M");
const {isValidid} = require('../middelware/users_MID.js');
const {getOneUser, deleteUserFromDB} = require("../controller/users_C");
const {  deleteUser } = require("../controller/users_C");

router.get('/', getAllUsers);

router.get('/:id', isValidid, getOneUser);


router.delete('/:id', isValidid, deleteUser);


module.exports = router;
