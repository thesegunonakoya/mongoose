document.getElementById('updatePasswordForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const userName = document.getElementById('userName').value;
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;

    const response = await fetch('http://localhost:7000/api/v1/user/update-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, oldPassword, newPassword }),
    });

    const result = await response.json();
    alert(result.message);
});
