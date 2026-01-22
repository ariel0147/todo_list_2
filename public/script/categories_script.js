const categoriesTable = document.getElementById('categoriesTable');

// =========================================================
// 1. לוגיקת עיצוב עכבר (Cursor Glow)
// =========================================================
const cursor = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', function(e) {
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// =========================================================
// 2. טעינה ותצוגה (READ)
// =========================================================
async function loadCategories() {
    try {
        // שליחת בקשה לנתיב שהגדרנו ב-routes/categories_R.js
        const res = await fetch('/categories');

        // אם המשתמש לא מחובר, זרוק אותו ללוגין
        if (res.status === 401) {
            window.location.href = "/login";
            return;
        }

        const data = await res.json();

        if (res.ok) {
            renderTable(data.categories);
        } else {
            console.error(data.message);
            // אם אין קטגוריות או יש שגיאה, נציג טבלה ריקה
            renderTable([]);
        }
    } catch (err) {
        console.error("Error loading categories:", err);
    }
}

function renderTable(categories) {
    let html = '';
    if (categories && categories.length > 0) {
        categories.forEach(cat => {
            html += `
                <tr>
                    <td>${cat.id}</td>
                    <td>${cat.name}</td>
                    <td>
                        <button class="action-btn">🗑️</button> 
                        <button class="action-btn">✏️</button>
                    </td>
                </tr>
            `;
        });
    } else {
        html = '<tr><td colspan="3">לא נמצאו קטגוריות</td></tr>';
    }
    categoriesTable.innerHTML = html;
}

// הפעלת הטעינה בעת טעינת הדף
loadCategories();