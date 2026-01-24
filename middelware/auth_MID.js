const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


function valuesToAdd(req, res, next) {
    const { name, email, pass, userName } = req.body;
    if (!name || !email || !pass || !userName) {
        return res.status(400).send({ error: "חסרים נתונים" });
    }
    next();
}

function valuesToLogin(req, res, next) {
    let { pass, userName } = req.body;
    if (  !pass || !userName) {
        return res.status(400).send({ error: "חסרים נתונים" });
    }
    next();
}


// הצפנת סיסמה
async function encryPass(req,res,next){
    try{
        let pass = req.body.pass;
        let hashPass = await bcrypt.hash(pass,10);
        req.pass = hashPass;
        next();
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Server error"});
    }
}

function isLoggedIn(req, res, next) {
    const token = req.cookies.jwt; // דורש cookie-parser
    if (!token) {
        return res.status(401).json({ message: "לא התחברת למערכת" });
    }
    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        req.user = payload;
        next();
    } catch (err) {
        console.error(err);
        return res.status(403).json({ message: "טוקן לא תקין" });
    }
}


module.exports = {
    valuesToAdd,
    encryPass,
    valuesToLogin,
    isLoggedIn,
};