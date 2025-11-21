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

async function updateUserFromDB(id, user) {
    let keys = Object.keys(user);      // ['name', 'email']
    let values = Object.values(user);  // ['Ariel', 'test@gmail.com']
    let set = keys.map(k => `${k} = ?`).join(', ');
    let sql = `UPDATE users SET ${set} WHERE id = ?`;
    let [result] = await db.query(sql, [...values,id]);

    return result.affectedRows;
}



module.exports = {
    getAll,
    getOne,
    deleteUserFromDB,
    updateUserFromDB
};
