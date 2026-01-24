const express = require('express');
const router = express.Router();
const {valuesToAdd,encryPass,valuesToLogin} = require("../middelware/auth_MID");
const {register ,login,createJwt } = require("../controller/auth_C.js");
const {logout} = require("../controller/auth_C");


router.post('/reg', valuesToAdd, encryPass, register);

router.post('/login', valuesToLogin,login,createJwt);

router.post('/logout', logout);

module.exports = router;