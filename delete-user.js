// Delete user functionality
document.getElementById('delete-user-submit').addEventListener('click', function() {
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
