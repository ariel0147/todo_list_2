const express = require('express');
const router = express.Router();
const path = require('path');
const { isLoggedIn } = require("../middelware/auth_MID");

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "page", "login.html"));
});


router.get('/home', isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "page", "index.html"));
});

router.get('/reg', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "page", "reg.html"));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "page", "login.html"));
});


router.get('/users_page', isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "page", "users.html"));
});

router.get('/categories_page', isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "page", "categories.html"));
});

module.exports = router;