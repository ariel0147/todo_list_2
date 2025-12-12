const express = require('express');
const router = express.Router();
const { getAllcategories, addcategories, getOneCategory, deleteCategory } = require("../controller/categories_C");
const { isValidid } = require('../middelware/users_MID.js');
const {isLoggedIn} = require("../middelware/auth_MID");

router.get('/', isLoggedIn,getAllcategories);
router.post('/',isLoggedIn,addcategories);

router.get('/:id', isLoggedIn, isValidid, getOneCategory);

router.delete('/:id', isLoggedIn, isValidid, deleteCategory);
module.exports = router;

