const { getAll, getBycategoriesName, add, getOne, deleteCategoryFromDB } = require('../model/categories_M.js');

// הצגת כל הקטגוריות
async function getAllcategories(req, res) {
    try {
        let categories = await getAll();
        if (categories.length === 0) {
            return res.status(400).json({ message: "אין נתונים בקטגוריות." });
        }
        res.status(200).json({ message: "ok", categories });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

async function addcategories(req, res) {
    try {
        let name = req.body.name;
        let userId = req.user.id; // <--- שליפת המזהה של המשתמש המחובר

        if (!name) {
            return res.status(400).json({ message: "חובה לשלוח שם קטגוריה" });
        }

        // בדיקה אם הקטגוריה קיימת (אפשר לשפר בעתיד לבדיקה לפי משתמש ספציפי)
        let existingCategory = await getBycategoriesName(name);
        if (existingCategory) {
            return res.status(409).json({ message: "שם קטגוריה קיים במערכת" });
        }

        // שליחת השם + מזהה המשתמש למודל
        let newCategoryId = await add(name, userId);

        if (!newCategoryId) {
            return res.status(500).json({ message: "שגיאה בשמירת הקטגוריה" });
        }

        res.status(201).json({ message: "נוסף בהצלחה", id: newCategoryId });
    } catch (err) {
        console.error("Error adding category:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}
// שליפת קטגוריה אחת לפי ID
async function getOneCategory(req, res) {
    try {
        let category = await getOne(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "הקטגוריה לא נמצאה" });
        }
        res.status(200).json({ message: "ok", category });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

// מחיקת קטגוריה
async function deleteCategory(req, res) {
    try {
        const id = req.params.id;
        const result = await deleteCategoryFromDB(id);
        if (!result || result.affectedRows === 0) {
            return res.status(404).json({ message: "לא ניתן למחוק: הקטגוריה לא נמצאה" });
        }
        res.status(200).json({ message: "הקטגוריה נמחקה בהצלחה" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

module.exports = {
    getAllcategories,
    addcategories,
    getOneCategory,
    deleteCategory,
};