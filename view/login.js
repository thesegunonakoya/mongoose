document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = {
        userName: document.getElementById('userName').value,
        password: document.getElementById('password').value
    };

    const response = await fetch('/api/v1/user/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });

    const result = await response.json();
    if (response.ok) {
        alert("Login successful");
    } else {
        alert(result.message);
    }
});
