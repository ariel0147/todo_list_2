const { getAll } = require('../model/tasks_M.js');

async function getAlltasks(req, res) {
    try {
        let userId = req.user.id;
        let tasks = await getAll(userId);

        if (tasks.length === 0) {
            return res.status(200).json({ message: "אין לך משימות עדיין", tasks: [] });
        }
        res.status(200).json({ message: "ok", tasks });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}
module.exports = {
    getAlltasks,
};