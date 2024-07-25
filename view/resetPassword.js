document.getElementById('resetPasswordForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const token = document.getElementById('token').value;
    const newPassword = document.getElementById('newPassword').value;

    const response = await fetch('http://localhost:7000/api/v1/user/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
    });

    const result = await response.json();
    alert(result.message);
});
