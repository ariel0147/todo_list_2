// routes/tasks_R.js
const express = require('express');
const router = express.Router();

// שינוי: החלפתי את updatetasks ב-editTask
const { getAlltasks, addtasks, getOnetasks, deletetasks, editTask } = require("../controller/tasks_C");
const { isLoggedIn } = require("../middelware/auth_MID");

const { valuesToAdd, isValidId, valuesToEdit } = require("../middelware/tasks_MID");

router.get('/', isLoggedIn, getAlltasks);

router.post('/', isLoggedIn, valuesToAdd, addtasks);

router.get('/:id', isLoggedIn, isValidId, getOnetasks);
router.delete('/:id', isLoggedIn, isValidId, deletetasks);

// שינוי: שימוש ב-editTask
router.patch('/:id', isLoggedIn, isValidId, valuesToEdit, editTask);

module.exports = router;