const express = require('express');
const router = express.Router();
const {getAlltasks } = require("../controller/tasks_C");

const {isLoggedIn} = require("../middelware/auth_MID");
const {addcategories, getOneCategory, deleteCategory, updateCategory} = require("../controller/categories_C");
const {isValidid} = require("../middelware/users_MID");

router.get('/', isLoggedIn,getAlltasks);

router.post('/',isLoggedIn,addtasks);

router.get('/:id', isLoggedIn, isValidid, getOnetasks);

router.delete('/:id', isLoggedIn, isValidid, deletetasks);

router.patch('/:id', isLoggedIn, isValidid, updatetasks);

module.exports = router;