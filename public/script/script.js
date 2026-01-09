/* --- לוגיקה של דרקון מעופף --- */
let mouseX = 0, mouseY = 0;
let dragonX = 0, dragonY = 0;
const speed = 0.08;
const dragonSize = 160;
const offset = dragonSize / 2;

document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateDragon() {
    const dragon = document.querySelector('.cursor-glow');
    // עדכנתי את הרשימה: הסרתי את .add-task-container כי הוא לא קיים יותר
    const forbiddenZones = document.querySelectorAll('.input, table, .filter-container');

    if (dragon) {
        let targetX = mouseX;
        let targetY = mouseY;

        forbiddenZones.forEach(zone => {
            const rect = zone.getBoundingClientRect();
            const limitLeft = rect.left - offset;
            const limitRight = rect.right + offset;
            const limitTop = rect.top - offset;
            const limitBottom = rect.bottom + offset;

            if (mouseX > limitLeft && mouseX < limitRight &&
                mouseY > limitTop && mouseY < limitBottom) {

                const distLeft = mouseX - limitLeft;
                const distRight = limitRight - mouseX;
                const distTop = mouseY - limitTop;
                const distBottom = limitBottom - mouseY;
                const min = Math.min(distLeft, distRight, distTop, distBottom);

                if (min === distLeft) targetX = limitLeft;
                else if (min === distRight) targetX = limitRight;
                else if (min === distTop) targetY = limitTop;
                else if (min === distBottom) targetY = limitBottom;
            }
        });

        dragonX += (targetX - dragonX) * speed;
        dragonY += (targetY - dragonY) * speed;
        const dx = targetX - dragonX;
        const dy = targetY - dragonY;
        let angle = Math.atan2(dy, dx) * 180 / Math.PI;
        angle = angle - 180;
        dragon.style.left = dragonX + 'px';
        dragon.style.top = dragonY + 'px';
        dragon.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    }
    requestAnimationFrame(animateDragon);
}
animateDragon();


/* --- לוגיקת המשימות והממשק --- */

let allTasksData = [];
let categoriesMap = {};

let greating = "Hello ";
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
        let response = await fetch(`/tasks/${id}`,{
            method:'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({text})
        })
        getTasks();
        document.getElementById('text').value = "";
    } catch (err) {
        alert(err)
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
        console.log(text);

        let catId = document.getElementById('mySelect').value;
        if(catId == 0){
            catId = null;
        }
        let response = await fetch('/tasks',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({text,catId})
        })
        getTasks();
        document.getElementById('text').value = "";
    } catch (err) {
        alert(err)
    }
}


(async function init() {
    await loadCategories();
    await getTasks();
})();