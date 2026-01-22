const usersTable = document.getElementById('usersTable');

async function loadUsers() {
    try {
        const res = await fetch('/users');
        if (res.status === 401) {
            window.location.href = "/login";
            return;
        }
        const data = await res.json();

        if (res.ok) {
            renderTable(data.users);
        } else {
            console.error(data.message);
        }
    } catch (err) {
        console.error(err);
    }
}

function renderTable(users) {
    let html = '';
    if (users && users.length > 0) {
        users.forEach(user => {
            html += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.userName}</td>
                    <td>
                        <button onclick="deleteUser(${user.id})">🗑️</button> 
                        <button onclick="editUser(${user.id})">✏️</button>
                    </td>
                </tr>
            `;
        });
    } else {
        html = '<tr><td colspan="5">לא נמצאו משתמשים</td></tr>';
    }
    usersTable.innerHTML = html;
}

async function deleteUser(id) {

    if (!confirm("האם אתה בטוח שברצונך למחוק משתמש זה?")) {
        return;
    }

    try {
        let response = await fetch('/users/' + id, {
            method: 'DELETE'
        });

        if (response.status === 200) {

            loadUsers();
        } else {
            let data = await response.json();
            alert(data.message || "שגיאה במחיקת המשתמש");
        }
    } catch (err) {
        console.error(err);
        alert("שגיאה בתקשורת עם השרת");
    }
}


function editUser(id) {
    alert("פונקציונליות עריכה תתווסף בשלב הבא (" + id + ")");
}

loadUsers();


const cursor = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', function(e) {
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});