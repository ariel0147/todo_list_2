const db = require("../config/db_config");

async function getAll(){
    let sql = `SELECT name FROM categoris`;
    let [rows] = await db.query(sql);
    return rows;
}
async function getBycategoriesName(Name){
    let sql = `SELECT * FROM users WHERE Name = ?`;
    let [result] = await db.query(sql,[Name]);
    return result[0];
}

module.exports = {
    getAll,
    getBycategoriesName



};
