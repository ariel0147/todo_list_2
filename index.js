const express = require('express');
require('dotenv').config();
const port = process.env.PORT;
const api = process.env.HOST;
const path = require('path');
const app = express();

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html');
})


app.listen(port,()=>{console.log(`http://${process.env.HOST}:${port}`)});










