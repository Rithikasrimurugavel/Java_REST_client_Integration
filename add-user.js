// Add user form submission
document.getElementById('add-user-form').addEventListener('submit', function(e) {
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
    })
    .catch(error => {
        console.error('Error adding user:', error);
        alert('Failed to add user.');
    });
});
