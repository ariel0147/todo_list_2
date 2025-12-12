const db = require("../config/db_config");

async function getAll() {
    // שליפת כל הקטגוריות
    let sql = `SELECT * FROM categoris`;
    let [rows] = await db.query(sql);
    return rows;
}

async function getBycategoriesName(name) {
    // תיקון: שיניתי מ-users ל-categoris
    let sql = `SELECT * FROM categoris WHERE name = ?`;
    let [result] = await db.query(sql, [name]);
    return result[0];
}

// --- הוספת הפונקציה שהייתה חסרה ---
async function add(name) {
    let sql = `INSERT INTO categoris (name) VALUES (?)`;
    let [result] = await db.query(sql, [name]);
    return result.insertId;
}
// ----------------------------------

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
    add,                   // עכשיו זה יעבוד כי הפונקציה add מוגדרת למעלה
    getOne,
    deleteCategoryFromDB
};