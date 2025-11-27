const express = require('express');
const {getAllUsers} = require("../controller/users_C");
const router = express.Router();
const {valuesToAdd,encryPass} = require("../middelware/auth_MID");
const {addUser} = require("../controller/auth_C.js");

router.post('/reg', valuesToAdd, encryPass, addUser);




module.exports = router;