// Update user functionality
document.getElementById('load-user-btn').addEventListener('click', function() {
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
