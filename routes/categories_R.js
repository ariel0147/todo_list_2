const express = require('express');
const router = express.Router();
const { getAllcategories,addcategories} = require("../controller/categories_C");
// const {} = require('../middelware/categories_MID');
const {isLoggedIn} = require("../middelware/auth_MID");

router.get('/', isLoggedIn,getAllcategories);
// router.get('/:id', isValidid, getOneUser);
// router.delete('/:id', isLoggedIn,isValidid, deleteUser);
router.post('/',isLoggedIn,addcategories);




module.exports = router;
