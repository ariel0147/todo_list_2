const db = require("../config/db_config");


async function getAll(userId) {
    let sql = `SELECT * FROM categoris WHERE user_id = ?`;
    let [rows] = await db.query(sql, [userId]);
    return rows;
}


async function getBycategoriesName(name, userId) {
    let sql = `SELECT * FROM categoris WHERE name = ? AND user_id = ?`;
    let [result] = await db.query(sql, [name, userId]);
    return result[0];
}


async function add(name, userId) {
    let sql = `INSERT INTO categoris (name, user_id) VALUES (?, ?)`;
    let [result] = await db.query(sql, [name, userId]);
    return result.insertId;
}


async function getOne(id, userId) {
    let sql = `SELECT * FROM categoris WHERE id = ? AND user_id = ?`;
    let [result] = await db.query(sql, [id, userId]);
    return result[0];
}


async function deleteCategoryFromDB(id, userId) {

    const sqlTasks = 'DELETE FROM tasks WHERE category_id = ? AND user_id = ?';
    await db.query(sqlTasks, [id, userId]);


    const sqlCategory = 'DELETE FROM categoris WHERE id = ? AND user_id = ?';
    let [result] = await db.query(sqlCategory, [id, userId]);

    return result;
}


async function update(id, userId, name) {
    let sql = `UPDATE categoris SET name = ? WHERE id = ? AND user_id = ?`;
    let [result] = await db.query(sql, [name, id, userId]);
    return result.affectedRows;
}

module.exports = {
    getAll,
    getBycategoriesName,
    add,
    getOne,
    deleteCategoryFromDB,
    update
};