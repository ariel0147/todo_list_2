const bcrypt = require('bcrypt');

// בדיקה אם כל הערכים קיימים
function valuesToAdd(req, res, next) {
    const { name, email, pass, username } = req.body;
    if (!name || !email || !pass || !username) {
        return res.status(400).send({ error: "חסרים נתונים" });
    }
    next();
}

// הצפנת סיסמה
async function encryPass(req, res, next) {
    try {
        const pass = req.body.pass;
        console.log("original pass:", pass);

        // hash עם 10 סיבובים
        const hashPass = await bcrypt.hash(pass, 10);
        console.log("hashed pass:", hashPass);

        // מחליפים את הסיסמה המקורית בגוף הבקשה
        req.body.pass = hashPass;

        next();
    } catch (err) {
        console.error("Error hashing password:", err);
        res.status(500).send({ error: "שגיאה בהצפנת הסיסמה" });
    }
}

module.exports = {
    valuesToAdd,
    encryPass
};
