const express = require('express');
const router = express.Router();
const path = require('path');


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "page", "login.html"));
});


router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "page", "index.html"));
});

router.get('/reg', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "page", "reg.html"));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "page", "login.html"));
});

module.exports = router;