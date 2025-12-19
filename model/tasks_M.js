
const db = require("../config/db_config");

async function getAll(userId) {
    let sql = `SELECT * FROM tasks WHERE user_id = ?`;
    let [rows] = await db.query(sql, [userId]);
    return rows;
}


async function getOne(id, userId) {
    let sql = `SELECT * FROM tasks WHERE id = ? AND user_id = ?`;
    let [result] = await db.query(sql, [id, userId]);
    return result[0];
}


async function add(text, userId) {
    let sql = `INSERT INTO tasks (text, user_id) VALUES (?, ?)`;
    let [result] = await db.query(sql, [text, userId]);
    return result.insertId;
}


async function deleteTaskFromDB(id, userId) {
    const sql = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';
    let [result] = await db.query(sql, [id, userId]);
    return result;
}


async function update(id, userId, fieldsToUpdate) {
    let keys = Object.keys(fieldsToUpdate);
    let values = Object.values(fieldsToUpdate);


    let set = keys.map(k => `${k}=?`).join(',');

    let sql = `UPDATE tasks SET ${set} WHERE id = ? AND user_id = ?`;
    let [result] = await db.query(sql, [...values, id, userId]);
    return result.affectedRows;
}

module.exports = {
    getAll,
    getOne,
    add,
    deleteTaskFromDB,
    update
};