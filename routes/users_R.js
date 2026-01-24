const express = require('express');
const router = express.Router();
const { getAllUsers, getOneUser, deleteUser, updateUser } = require("../controller/users_C");
const { isLoggedIn } = require("../middelware/auth_MID");


const { isValidid, valuesToEdit, checkPermissions } = require('../middelware/users_MID.js');

router.get('/', isLoggedIn, getAllUsers);
router.get('/:id', isValidid, getOneUser);
router.delete('/:id', isLoggedIn, isValidid, checkPermissions, deleteUser);
router.patch('/:id', isLoggedIn, isValidid, checkPermissions, valuesToEdit, updateUser);

module.exports = router;