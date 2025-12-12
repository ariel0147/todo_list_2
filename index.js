const express = require('express');
require('dotenv').config();
const port = process.env.PORT;
const api = process.env.HOST;
const path = require('path');
const app = express();
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
const cookies = require('cookie-parser');
const db = require('./config/db_config');
app.use(cookies());

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html');
})

app.use('/users',require('./routes/users_R'));

app.use('/auth',require('./routes/auth_R'));

app.use('/categories',require('./routes/categories_R'));

app.use('/tasks',require('./routes/tasks_R'));
app.listen(port,()=>{console.log(`http://${api}:${port}`)});








