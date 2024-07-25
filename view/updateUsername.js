document.getElementById('updateUsernameForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const currentUserName = document.getElementById('currentUserName').value;
    const newUserName = document.getElementById('newUserName').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:7000/api/v1/user/update-username', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentUserName, newUserName, password }),
    });

    const result = await response.json();
    alert(result.message);
});
