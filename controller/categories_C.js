
const { getAll, getBycategoriesName, add, getOne, deleteCategoryFromDB } = require('../model/categories_M.js');

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
        let existingCategory = await getBycategoriesName(name);
        if (existingCategory) {
            return res.status(409).json({ message: "שם קטגוריה קיים במערכת" });
        }
        let newCategoryId = await add(name);
        if (!newCategoryId) {
            return res.status(500).json({ message: "Server error" });
        }
        res.status(201).json({ message: "נוסף בהצלחה" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}


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