const db = require("../config/db_config");

async function getAll() {

    let sql = `SELECT * FROM categoris`;
    let [rows] = await db.query(sql);
    return rows;
}

async function getBycategoriesName(name) {

    let sql = `SELECT * FROM categoris WHERE name = ?`;
    let [result] = await db.query(sql, [name]);
    return result[0];
}



async function add(name, userId) {

    let sql = `INSERT INTO categoris (name, user_id) VALUES (?, ?)`;

    // שליחת שני הפרמטרים (שם ומזהה משתמש)
    let [result] = await db.query(sql, [name, userId]);
    return result.insertId;
}


async function getOne(id) {
    let sql = `SELECT * FROM categoris WHERE id = ?`;
    let [result] = await db.query(sql, [id]);
    return result[0];
}

async function deleteCategoryFromDB(id) {
    const sql = 'DELETE FROM categoris WHERE id = ?';
    let [result] = await db.query(sql, [id]);
    return result;
}

module.exports = {
    getAll,
    getBycategoriesName,
    add,
    getOne,
    deleteCategoryFromDB
};