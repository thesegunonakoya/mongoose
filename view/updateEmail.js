document.getElementById('updateEmailForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const currentEmail = document.getElementById('currentEmail').value;
    const newEmail = document.getElementById('newEmail').value;
    const userName = document.getElementById('userName').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:7000/api/v1/user/update-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentEmail, newEmail, userName, password }),
    });

    const result = await response.json();
    alert(result.message);
});
