// Global variable to store all users
let allUsers = [];

// Navigation functions
function showSection(sectionId) {
    document.getElementById('home-menu').style.display = 'none';
    document.querySelectorAll('.container').forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}

function showHome() {
    document.getElementById('home-menu').style.display = 'flex';
    document.querySelectorAll('.container').forEach(section => section.style.display = 'none');
}

// Event listeners for navigation
document.getElementById('view-all-btn').addEventListener('click', () => {
    showSection('view-all-section');
    fetchUsers();
});

document.getElementById('search-id-btn').addEventListener('click', () => showSection('search-id-section'));
document.getElementById('add-user-btn').addEventListener('click', () => showSection('add-user-section'));
document.getElementById('update-user-btn').addEventListener('click', () => showSection('update-user-section'));
document.getElementById('delete-user-btn').addEventListener('click', () => showSection('delete-user-section'));

// Back to home buttons
document.querySelectorAll('[id^="back-to-home"]').forEach(btn => {
    btn.addEventListener('click', showHome);
});

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
    if (!userList) return;
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
document.getElementById('search-input')?.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
    displayUsers(filteredUsers);
});

// Search by ID
document.getElementById('search-id-submit')?.addEventListener('click', function() {
    const id = document.getElementById('search-id-input').value;
    if (!id) {
        alert('Please enter a user ID');
        return;
    }

    fetch(`/client/users/${id}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('User not found');
            }
        })
        .then(user => {
            document.getElementById('search-result').innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${user.name}</h5>
                        <p class="card-text">
                            <strong>Email:</strong> ${user.email}<br>
                            <strong>ID:</strong> ${user.id}<br>
                            <strong>Username:</strong> ${user.username || 'N/A'}<br>
                            <strong>Phone:</strong> ${user.phone || 'N/A'}
                        </p>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error searching user:', error);
            document.getElementById('search-result').innerHTML = `<p class="text-danger">User not found.</p>`;
        });
});

// Add user form submission
document.getElementById('add-user-form')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const newUser = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        phone: document.getElementById('phone').value,
        website: document.getElementById('website').value
    };

    fetch('/client/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
    .then(response => response.json())
    .then(user => {
        document.getElementById('add-user-form').reset();
        alert('User added successfully!');
        showHome();
    })
    .catch(error => {
        console.error('Error adding user:', error);
        alert('Failed to add user.');
    });
});

// Update user functionality
document.getElementById('load-user-btn')?.addEventListener('click', function() {
    const id = document.getElementById('update-id-input').value;
    if (!id) {
        alert('Please enter a user ID');
        return;
    }

    fetch(`/client/users/${id}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('User not found');
            }
        })
        .then(user => {
            document.getElementById('update-form-container').innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <form id="update-user-form">
                            <div class="row">
                                <div class="col-md-6">
                                    <input type="text" id="update-name" class="form-control mb-2" placeholder="Name" value="${user.name}" required>
                                </div>
                                <div class="col-md-6">
                                    <input type="email" id="update-email" class="form-control mb-2" placeholder="Email" value="${user.email}" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <input type="text" id="update-username" class="form-control mb-2" placeholder="Username" value="${user.username || ''}">
                                </div>
                                <div class="col-md-6">
                                    <input type="text" id="update-phone" class="form-control mb-2" placeholder="Phone" value="${user.phone || ''}">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <input type="text" id="update-website" class="form-control mb-2" placeholder="Website" value="${user.website || ''}">
                                </div>
                                <div class="col-md-6">
                                    <button type="submit" class="btn btn-primary">Update User</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            `;

            // Update form submission
            document.getElementById('update-user-form').addEventListener('submit', function(e) {
                e.preventDefault();

                const updatedUser = {
                    name: document.getElementById('update-name').value,
                    email: document.getElementById('update-email').value,
                    username: document.getElementById('update-username').value,
                    phone: document.getElementById('update-phone').value,
                    website: document.getElementById('update-website').value
                };

                fetch(`/client/users/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedUser)
                })
                .then(() => {
                    alert('User updated successfully!');
                    showHome();
                })
                .catch(error => {
                    console.error('Error updating user:', error);
                    alert('Failed to update user.');
                });
            });
        })
        .catch(error => {
            console.error('Error loading user:', error);
            document.getElementById('update-form-container').innerHTML = `<p class="text-danger">User not found.</p>`;
        });
});

// Delete user functionality
document.getElementById('delete-user-submit')?.addEventListener('click', function() {
    const id = document.getElementById('delete-id-input').value;
    if (!id) {
        alert('Please enter a user ID');
        return;
    }

    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`/client/users/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            document.getElementById('delete-result').innerHTML = `<p class="text-success">User deleted successfully!</p>`;
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            document.getElementById('delete-result').innerHTML = `<p class="text-danger">Failed to delete user.</p>`;
        });
    }
});

// Delete from view all section
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
