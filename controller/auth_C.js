const db = require("../config/db_config"); // החיבור למסד שלך

async function addUser(req, res) {
    try {
        const { name, email, username, pass } = req.body; // pass כבר מוצפן במידלוור
        const result = await db.query(
            "INSERT INTO users (name,email,username,pass) VALUES (?,?,?,?)",
            [name, email, username, pass]
        );
        res.status(201).send({ message: "User added", id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error adding user" });
    }
}

module.exports = { addUser };
