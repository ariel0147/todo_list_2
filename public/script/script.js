
const cursor = document.querySelector('.cursor-glow');


document.addEventListener('mousemove', function(e) {
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});




let allTasksData = [];
let categoriesMap = {};

let greating = "שלום ";
if (localStorage.getItem('name')) {
    greating += localStorage.getItem('name');
}
document.getElementById('greating').innerHTML = greating;

async function loadCategories() {
    try {
        let response = await fetch('/categories');
        let data = await response.json();

        if (response.status === 200 && data.categories) {
            let filterSelect = document.getElementById('categoryFilter');

            if(filterSelect) filterSelect.innerHTML = '<option value="all">הצג הכל</option>';

            data.categories.forEach(cat => {
                categoriesMap[cat.id] = cat.name;

                if (filterSelect) {
                    let optionFilter = document.createElement('option');
                    optionFilter.value = cat.id;
                    optionFilter.innerText = cat.name;
                    filterSelect.appendChild(optionFilter);
                }
            });
        }
    } catch (err) {
        console.error("Failed to load categories", err);
    }
}

async function getTasks() {
    try {
        let response = await fetch('/tasks');
        if (response.status == 401) {
            window.location.href = '/login';
            return;
        }
        let data = await response.json();
        if (response.status == 400) {
            allTasksData = [];
            createTable([]);
            if(data.message !== "אין לך משימות עדיין") alert(data.message);
            return;
        }

        allTasksData = data.tasks || [];
        filterTasks();

    } catch (err) {
        console.error(err);
    }
}

function filterTasks() {
    let filterElement = document.getElementById('categoryFilter');
    if (!filterElement) return;

    let categoryId = filterElement.value;

    if (categoryId === "all") {
        createTable(allTasksData);
    } else {
        let filteredTasks = allTasksData.filter(task => task.category_id == categoryId);
        createTable(filteredTasks);
    }
}

function createTable(data) {
    let txt = "";
    if (data && data.length > 0) {
        for (let obj of data) {
            if (obj) {
                let isChecked = obj.is_done ? "checked" : "";
                let rowClass = obj.is_done ? "class='rowClass'" : "";

                let categoryName = categoriesMap[obj.category_id] ? categoriesMap[obj.category_id] : obj.category_id;
                if (!categoryName) categoryName = "-";

                txt += `<tr ${rowClass}>`;
                txt += `<td><input type="checkbox" ${isChecked} onchange="taskDone(${obj.id}, this)"></td>`;
                txt += `<td>${obj.text}</td>`;
                txt += `<td>${categoryName}</td>`;
                txt += `<td><button onclick="deleteTask(${obj.id})">🗑️</button></td>`;
                txt += `<td><button onclick="taskToEdit(${obj.id})">✏️</button></td>`;
                txt += "</tr>";
            }
        }
    } else {
        txt = "<tr><td colspan='5'>אין משימות להצגה</td></tr>";
    }

    let tableElement = document.getElementById('myTable');
    if (tableElement) {
        tableElement.innerHTML = txt;
    }
}

async function taskDone(id, element) {
    let row = element.closest('tr');

    if (element.checked) {
        row.classList.add('rowClass');
    } else {
        row.classList.remove('rowClass');
    }

    try {
        let response = await fetch('/tasks/' + id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_done: element.checked ? 1 : 0 })
        });

        if (!response.ok) {
            alert("שגיאה בעדכון");
            element.checked = !element.checked;
            if(element.checked) row.classList.add('rowClass');
            else row.classList.remove('rowClass');
        } else {
            let task = allTasksData.find(t => t.id === id);
            if (task) task.is_done = element.checked ? 1 : 0;
        }
    } catch (err) {
        console.error(err);
    }
}

async function deleteTask(id) {
    if (!confirm("האם למחוק את המשימה?")) return;

    try {
        let response = await fetch('/tasks/' + id, { method: 'DELETE' });
        if (response.status == 200) {
            allTasksData = allTasksData.filter(t => t.id !== id);
            filterTasks();
        } else {
            alert("שגיאה במחיקה");
        }
    } catch (err) {
        alert(err);
    }
}

async function editTask(id) {
    try {
        let text = document.getElementById('text').value;

        let response = await fetch(`/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (response.ok) {
            await getTasks();
            document.getElementById('text').value = "";
            document.getElementById('id').value = "";
        } else {
            alert("שגיאה בעדכון המשימה");
        }
    } catch (err) {
        alert(err);
    }
}

function addOrEdit(){
    let id = document.getElementById('id').value;
    if(id){
        editTask(id);
    }else{
        addTask();
    }
}

async function addTask() {
    try {
        let text = document.getElementById('text').value;
        if (!text) {
            alert("נא לכתוב תוכן למשימה");
            return;
        }

        let filterSelect = document.getElementById('categoryFilter');
        let category_id = null;

        if (filterSelect && filterSelect.value !== "all") {
            category_id = filterSelect.value;
        }

        let response = await fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, category_id })
        });

        if (response.status === 201) {
            await getTasks();
            document.getElementById('text').value = "";
        } else {
            let data = await response.json();
            alert(data.message || "שגיאה בהוספת משימה");
        }
    } catch (err) {
        console.error(err);
        alert("שגיאה בתקשורת עם השרת");
    }
}

function taskToEdit(id) {
    let task = allTasksData.find(t => t.id === id);

    if (task) {
        document.getElementById('text').value = task.text;
        document.getElementById('id').value = task.id;
    }
}
async function logout() {
    try {
        const res = await fetch('/auth/logout', {
            method: 'POST'
        });

        if (res.ok) {

            localStorage.removeItem('name');
            localStorage.removeItem('is_admin');
            window.location.href = '/login';
        } else {
            alert("שגיאה בהתנתקות");
        }
    } catch (err) {
        console.error("Error logging out:", err);
    }
}


(async function init() {
    await loadCategories();
    await getTasks();
})();