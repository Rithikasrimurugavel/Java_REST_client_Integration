// Search by ID
document.getElementById('search-id-submit').addEventListener('click', function() {
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
