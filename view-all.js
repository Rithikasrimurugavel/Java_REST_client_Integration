// Global variable to store all users
let allUsers = [];

// Fetch users from Spring Boot API and display
function fetchUsers() {
    fetch('/client/users')
        .then(response => response.json())
        .then(users => {
            allUsers = users;
            displayUsers(users);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            document.getElementById('user-list').innerHTML = `<p class="text-danger">Failed to load users.</p>`;
        });
}

// Display users in the UI
function displayUsers(users) {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'col-md-4';

        userCard.innerHTML = `
            <div class="card shadow-sm h-100">
                <div class="card-body">
                    <h5 class="card-title">${user.name}</h5>
                    <p class="card-text">
                        <strong>Email:</strong> ${user.email}<br>
                        <strong>ID:</strong> ${user.id}<br>
                        <strong>Username:</strong> ${user.username || 'N/A'}<br>
                        <strong>Phone:</strong> ${user.phone || 'N/A'}
                    </p>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${user.id}">Delete</button>
                </div>
            </div>
        `;

        userList.appendChild(userCard);
    });
}

// Search functionality
document.getElementById('search-input').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
    displayUsers(filteredUsers);
});

// Delete user functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        const userId = e.target.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this user?')) {
            fetch(`/client/users/${userId}`, {
                method: 'DELETE'
            })
            .then(() => {
                allUsers = allUsers.filter(user => user.id != userId);
                displayUsers(allUsers);
                alert('User deleted successfully!');
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                alert('Failed to delete user.');
            });
        }
    }
});

// Initial load
fetchUsers();
