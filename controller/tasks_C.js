// controller/tasks_C.js
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
        let taskId = req.id;
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

        // המרה בטוחה למספר (או null אם אין קטגוריה)
        let categoryId = req.body.category_id ? parseInt(req.body.category_id) : null;

        let userId = req.user.id;

        console.log(`Trying to add task: Text="${text}", CategoryID=${categoryId}, UserID=${userId}`);

        let newTaskId = await add(text, userId, categoryId);

        if (!newTaskId) {
            return res.status(500).json({ message: "שגיאה בשמירת המשימה" });
        }

        res.status(201).json({ message: "המשימה נוספה בהצלחה", id: newTaskId });
    } catch (err) {
        console.error("❌ Error adding task:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

async function deletetasks(req, res) {
    try {
        const id = req.id;
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

// הפונקציה שהייתה חסרה לך
async function editTask(req, res) {
    try {
        let taskId = req.id;
        let userId = req.user.id;
        let newTask = req.newTask;

        let affectedRows = await update(taskId, userId, newTask);
        if (!affectedRows) {
            return res.status(400).json({ message: `Task ${req.id} not found!` });
        }
        res.status(200).json({ message: "updated!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    getAlltasks,
    getOnetasks,
    addtasks,
    deletetasks,
    editTask
};