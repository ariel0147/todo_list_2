const usersTable = document.getElementById('usersTable');


let currentEditingRowId = null;

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
                <tr id="row-${user.id}">
                    <td>${user.id}</td>
                    <td class="name-cell">${user.name}</td>
                    <td class="email-cell">${user.email}</td>
                    <td class="username-cell">${user.userName}</td>
                    <td>
                        <button class="action-btn" onclick="deleteUser(${user.id})">🗑️</button> 
                        <button class="action-btn" onclick="editUser(${user.id})">✏️</button>
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
        let response = await fetch('/users/' + id, { method: 'DELETE' });
        if (response.status === 200) {
            loadUsers();
        } else {
            let data = await response.json();
            alert(data.message || "שגיאה במחיקה");
        }
    } catch (err) {
        console.error(err);
        alert("שגיאה בתקשורת");
    }
}

function editUser(id) {

    if (currentEditingRowId !== null) {
        loadUsers();
    }
    currentEditingRowId = id;

    let row = document.getElementById(`row-${id}`);
    let nameCell = row.querySelector('.name-cell');
    let emailCell = row.querySelector('.email-cell');
    let userCell = row.querySelector('.username-cell');
    let actionCell = row.lastElementChild;


    let currentName = nameCell.innerText;
    let currentEmail = emailCell.innerText;
    let currentUser = userCell.innerText;


    nameCell.innerHTML = `<input type="text" id="edit-name-${id}" value="${currentName}">`;
    emailCell.innerHTML = `<input type="email" id="edit-email-${id}" value="${currentEmail}">`;
    userCell.innerHTML = `<input type="text" id="edit-user-${id}" value="${currentUser}">`;


    actionCell.innerHTML = `
        <button onclick="saveUser(${id})">💾</button>
        <button onclick="loadUsers()">❌</button>
    `;
}

async function saveUser(id) {
    let newName = document.getElementById(`edit-name-${id}`).value;
    let newEmail = document.getElementById(`edit-email-${id}`).value;
    let newUserName = document.getElementById(`edit-user-${id}`).value;


    let objToSend = {
        name: newName,
        email: newEmail,
        username: newUserName
    };

    try {
        let response = await fetch('/users/' + id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(objToSend)
        });

        if (response.status === 200) {
            currentEditingRowId = null;
            loadUsers();
        } else {
            let data = await response.json();
            alert(data.message || "שגיאה בעדכון");
        }
    } catch (err) {
        console.error(err);
        alert("שגיאה בתקשורת");
    }
}

loadUsers();

const cursor = document.querySelector('.cursor-glow');
document.addEventListener('mousemove', function(e) {
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});