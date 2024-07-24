document.getElementById('resetPasswordForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = {
        token: document.getElementById('token').value,
        newPassword: document.getElementById('newPassword').value,
    };

    const response = await fetch('/api/v1/user/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });

    const result = await response.json();
    if (response.ok) {
        alert("Password reset successful");
    } else {
        alert(result.message);
    }
});
