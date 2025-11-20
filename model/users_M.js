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
    return result[0]; // מחזיר את השורה הראשונה בלבד
}

async function deleteUserFromDB(id){
    const sql = 'DELETE FROM users WHERE id = ?';
    console.log(sql);
    let [rows] = await db.query(sql, [id]);
    console.log(rows);
    return rows;
}

module.exports = {
    getAll,
    getOne,
    deleteUserFromDB
};
