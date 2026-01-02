/* --- לוגיקה של דרקון מעופף עם "שדה כוח" מורחב --- */
let mouseX = 0, mouseY = 0;
let dragonX = 0, dragonY = 0;
const speed = 0.08;
const dragonSize = 160;
const offset = dragonSize / 2; // הרדיוס של הדרקון (80px)

document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateDragon() {
    const dragon = document.querySelector('.cursor-glow');
    // בוחר את האלמנטים שאסור לדרקון לגעת בהם
    const forbiddenZones = document.querySelectorAll('.input, table');

    if (dragon) {
        let targetX = mouseX;
        let targetY = mouseY;

        // בדיקה עבור כל אזור אסור
        forbiddenZones.forEach(zone => {
            const rect = zone.getBoundingClientRect();

            // יצירת "גדר" וירטואלית מסביב לאלמנט במרחק הרדיוס של הדרקון
            // זה מבטיח שהדרקון יעצור *לפני* שהוא נוגע בקיר
            const limitLeft = rect.left - offset;
            const limitRight = rect.right + offset;
            const limitTop = rect.top - offset;
            const limitBottom = rect.bottom + offset;

            // בדיקה: האם העכבר נמצא בתוך ה"גדר" הזו?
            if (mouseX > limitLeft && mouseX < limitRight &&
                mouseY > limitTop && mouseY < limitBottom) {

                // חישוב המרחק לכל אחד מהקירות של הגדר
                const distLeft = mouseX - limitLeft;
                const distRight = limitRight - mouseX;
                const distTop = mouseY - limitTop;
                const distBottom = limitBottom - mouseY;

                // מציאת הקיר הקרוב ביותר והצמדת היעד אליו
                const min = Math.min(distLeft, distRight, distTop, distBottom);

                if (min === distLeft) targetX = limitLeft;
                else if (min === distRight) targetX = limitRight;
                else if (min === distTop) targetY = limitTop;
                else if (min === distBottom) targetY = limitBottom;
            }
        });

        // תנועה חלקה ליעד המחושב (העכבר או הגדר)
        dragonX += (targetX - dragonX) * speed;
        dragonY += (targetY - dragonY) * speed;

        // חישוב זווית
        const dx = targetX - dragonX;
        const dy = targetY - dragonY;
        let angle = Math.atan2(dy, dx) * 180 / Math.PI;

        // תיקון זווית (מותאם לתמונה שפונה שמאלה)
        angle = angle - 180;

        // עדכון המיקום
        dragon.style.left = dragonX + 'px';
        dragon.style.top = dragonY + 'px';
        dragon.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    }

    requestAnimationFrame(animateDragon);
}

animateDragon();
// --- לוגיקת המשימות ---

let greating = "Hello ";
if (localStorage.getItem('name')) {
    greating += localStorage.getItem('name');
}
document.getElementById('greating').innerHTML = greating;

async function getTasks() {
    try {
        let response = await fetch('/tasks');
        if (response.status == 401) {
            window.location.href = '/login';
            return;
        }
        let data = await response.json();
        if (response.status == 400) {
            alert(data.message);
            return;
        }
        createTable(data.tasks);
    } catch (err) {
        console.error(err);
    }
}

function createTable(data) {
    let txt = "";
    if (data && data.length > 0) {
        for (let obj of data) {
            if (obj) {
                let isChecked = obj.is_done ? "checked" : "";
                let rowClass = obj.is_done ? "class='rowClass'" : "";

                txt += `<tr ${rowClass}>`;
                txt += `<td><input type="checkbox" ${isChecked} onchange="taskDone(${obj.id}, this)"></td>`;
                txt += `<td>${obj.text}</td>`;
                txt += `<td>${obj.category_id}</td>`;
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
            getTasks();
        } else {
            alert("שגיאה במחיקה");
        }
    } catch (err) {
        alert(err);
    }
}

async function taskToEdit(id) {
    console.log("Edit task: " + id);
}

getTasks();