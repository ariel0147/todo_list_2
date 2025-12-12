const { getAll, getBycategoriesName, add, getOne, deleteCategoryFromDB, update } = require('../model/categories_M.js');

async function getAllcategories(req, res) {
    try {
        let userId = req.user.id; // זיהוי המשתמש
        let categories = await getAll(userId);

        if (categories.length === 0) {
            return res.status(200).json({ message: "אין לך קטגוריות עדיין", categories: [] });
        }
        res.status(200).json({ message: "ok", categories });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

async function addcategories(req, res) {
    try {
        let name = req.body.name;
        let userId = req.user.id; // זיהוי המשתמש

        if (!name) {
            return res.status(400).json({ message: "חובה לשלוח שם קטגוריה" });
        }

        let existingCategory = await getBycategoriesName(name, userId);
        if (existingCategory) {
            return res.status(409).json({ message: "כבר יצרת קטגוריה בשם זה" });
        }

        let newCategoryId = await add(name, userId);
        if (!newCategoryId) {
            return res.status(500).json({ message: "שגיאה בשמירת הקטגוריה" });
        }

        res.status(201).json({ message: "נוסף בהצלחה", id: newCategoryId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function getOneCategory(req, res) {
    try {
        let userId = req.user.id;
        let category = await getOne(req.params.id, userId);

        if (!category) {
            return res.status(404).json({ message: "הקטגוריה לא נמצאה או שאינה שייכת לך" });
        }
        res.status(200).json({ message: "ok", category });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

async function deleteCategory(req, res) {
    try {
        const id = req.params.id;
        const userId = req.user.id; // זיהוי המשתמש

        const result = await deleteCategoryFromDB(id, userId);
        if (!result || result.affectedRows === 0) {
            return res.status(404).json({ message: "לא ניתן למחוק: הקטגוריה לא נמצאה או שאינה שייכת לך" });
        }

        res.status(200).json({ message: "הקטגוריה נמחקה בהצלחה" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

async function updateCategory(req, res) {
    try {
        let id = req.params.id;
        let userId = req.user.id;
        let name = req.body.name;

        if (!name) {
            return res.status(400).json({ message: "חובה לשלוח שם קטגוריה לעדכון" });
        }
        let affectedRows = await update(id, userId, name);
        if (affectedRows === 0) {
            return res.status(404).json({ message: "לא ניתן לעדכן: הקטגוריה לא נמצאה או שאינה שייכת לך" });
        }

        res.status(200).json({ message: "הקטגוריה עודכנה בהצלחה" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

module.exports = {
    getAllcategories,
    addcategories,
    getOneCategory,
    deleteCategory,
    updateCategory,
};