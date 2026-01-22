const categoriesTable = document.getElementById('categoriesTable');


const cursor = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', function(e) {
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});


async function loadCategories() {
    try {
        const res = await fetch('/categories');

        if (res.status === 401) {
            window.location.href = "/login";
            return;
        }

        const data = await res.json();

        if (res.ok) {
            renderTable(data.categories);
        } else {
            console.error(data.message);
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
                <tr id="row-${cat.id}">
                    <td>${cat.id}</td>
                    <td>${cat.name}</td>
                    <td>
                        <button class="action-btn" onclick="deleteCategory(${cat.id})">🗑️</button> 
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


async function addCategory() {
    const nameInput = document.getElementById('categoryName');
    const name = nameInput.value;

    if (!name) {
        alert("נא להזין שם לקטגוריה");
        return;
    }

    try {
        const res = await fetch('/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name })
        });

        const data = await res.json();

        if (res.status === 201) {
            alert(data.message);
            nameInput.value = '';
            loadCategories();
        } else {
            alert(data.message || "שגיאה בהוספת הקטגוריה");
        }
    } catch (err) {
        console.error(err);
        alert("שגיאה בתקשורת עם השרת");
    }
}


async function deleteCategory(id) {

    const confirmed = confirm(
        "שים לב!\n" +
        "מחיקת קטגוריה זו עלולה לגרום למחיקת כל המשימות המשוייכות אליה.\n" +
        "האם אתה בטוח שברצונך להמשיך?"
    );

    if (!confirmed) return;

    try {
        const res = await fetch('/categories/' + id, {
            method: 'DELETE'
        });

        if (res.status === 200) {
            loadCategories();
        } else {
            const data = await res.json();
            alert(data.message || "שגיאה במחיקה");
        }
    } catch (err) {
        console.error(err);
        alert("שגיאה בתקשורת");
    }
}


loadCategories();