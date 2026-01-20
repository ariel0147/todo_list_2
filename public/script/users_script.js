const usersTable = document.getElementById('usersTable');

async function loadUsers() {
    try {
        const res = await fetch('/users');
        const data = await res.json();

        if (res.ok) {
            renderTable(data.users);
        } else {
            if (res.status === 401) window.location.href = "/login";
            else console.error(data.message);
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
                        <button>🗑️</button> 
                        <button>✏️</button>
                    </td>
                </tr>
            `;
        });
    } else {
        html = '<tr><td colspan="5">לא נמצאו משתמשים</td></tr>';
    }
    usersTable.innerHTML = html;
}

loadUsers();