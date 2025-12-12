const db = require("../config/db_config");

// שליפת כל הקטגוריות של המשתמש
async function getAll(userId) {
    let sql = `SELECT * FROM categoris WHERE user_id = ?`;
    let [rows] = await db.query(sql, [userId]);
    return rows;
}

// חיפוש לפי שם (עבור אותו משתמש בלבד)
async function getBycategoriesName(name, userId) {
    let sql = `SELECT * FROM categoris WHERE name = ? AND user_id = ?`;
    let [result] = await db.query(sql, [name, userId]);
    return result[0];
}

// הוספת קטגוריה חדשה
async function add(name, userId) {
    let sql = `INSERT INTO categoris (name, user_id) VALUES (?, ?)`;
    let [result] = await db.query(sql, [name, userId]);
    return result.insertId;
}

// שליפת קטגוריה בודדת
async function getOne(id, userId) {
    let sql = `SELECT * FROM categoris WHERE id = ? AND user_id = ?`;
    let [result] = await db.query(sql, [id, userId]);
    return result[0];
}

// מחיקת קטגוריה
async function deleteCategoryFromDB(id, userId) {
    const sql = 'DELETE FROM categoris WHERE id = ? AND user_id = ?';
    let [result] = await db.query(sql, [id, userId]);
    return result;
}

// עדכון קטגוריה
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