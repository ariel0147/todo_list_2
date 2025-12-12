const express = require('express');
const router = express.Router();
const {getAlltasks } = require("../controller/tasks_C");

const {isLoggedIn} = require("../middelware/auth_MID");

router.get('/', isLoggedIn,getAlltasks);

module.exports = router;