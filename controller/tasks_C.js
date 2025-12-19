const { getAll, getOne, add, deleteTaskFromDB, update } = require('../model/tasks_M.js');

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

async function getOnetasks(req, res) {
    try {
        let userId = req.user.id;
        let taskId = req.params.id;
        let task = await getOne(taskId, userId);

        if (!task) {
            return res.status(404).json({ message: "המשימה לא נמצאה או שאינה שייכת לך" });
        }
        res.status(200).json({ message: "ok", task });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

async function addtasks(req, res) {
    try {
        let text = req.body.text;
        let userId = req.user.id;



        let newTaskId = await add(text, userId);
        if (!newTaskId) {
            return res.status(500).json({ message: "שגיאה בשמירת המשימה" });
        }

        res.status(201).json({ message: "המשימה נוספה בהצלחה", id: newTaskId });
    } catch (err) {
        console.error("Error adding task:", err);
        res.status(500).json({ message: "Server error" });
    }
}

async function deletetasks(req, res) {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        const result = await deleteTaskFromDB(id, userId);
        if (!result || result.affectedRows === 0) {
            return res.status(404).json({ message: "לא ניתן למחוק: המשימה לא נמצאה או שאינה שייכת לך" });
        }

        res.status(200).json({ message: "המשימה נמחקה בהצלחה" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

async function updatetasks(req, res) {
    try {
        let id = req.params.id;
        let userId = req.user.id;
        let text = req.body.text;

        if (!text) {
            return res.status(400).json({ message: "חובה לשלוח תוכן משימה לעדכון" });
        }
        let affectedRows = await update(id, userId, text);

        if (affectedRows === 0) {
            return res.status(404).json({ message: "לא ניתן לעדכן: המשימה לא נמצאה או שאינה שייכת לך" });
        }

        res.status(200).json({ message: "המשימה עודכנה בהצלחה" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

module.exports = {
    getAlltasks,
    getOnetasks,
    addtasks,
    deletetasks,
    updatetasks
};