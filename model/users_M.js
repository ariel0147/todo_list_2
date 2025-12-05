const db = require("../config/db_config");

async function getAll(){
    let sql = `SELECT id,name,email FROM users`;
    console.log(sql);
    let [rows] = await db.query(sql);
    console.log(rows);
    return rows;
}

async function getOne(id){
    let sql = `SELECT id,name,email FROM users WHERE id = ?`;
    console.log(sql);
    let [result] = await db.query(sql, [id]);
    return result[0];
}

async function deleteUserFromDB(id){
    const sql = 'DELETE FROM users WHERE id = ?';
    console.log(sql);
    let [rows] = await db.query(sql, [id]);
    console.log(rows);
    return rows;
}

async function update(id,user){
    let keys = Object.keys(user);
    let values = Object.values(user);
    let set = keys.map(k=>`${k}=?`).join(',');
    let sql = `UPDATE users SET ${set} WHERE id = ?`;
    let [result] = await db.query(sql,[...values,id]);
    return result.affectedRows;
}

async function getByUserName(userName){
    let sql = `SELECT * FROM users WHERE userName = ?`;
    let [result] = await db.query(sql,[userName]);
    return result[0];
}

async function getByEmail(email){
    let sql = `SELECT * FROM users WHERE email = ?`;
    let [result] = await db.query(sql,[email]);
    return result[0];
}

async function addUser({name,email,userName,pass}){
    let sql = `INSERT INTO users (name,email,userName,pass) VALUES (?,?,?,?)`;
    let [result] = await db.query(sql,[name,email,userName,pass]);
    return result.insertId;
}

module.exports = {
    getAll,
    getOne,
    deleteUserFromDB,
    update,
    getByUserName,
    getByEmail,
    addUser

};
