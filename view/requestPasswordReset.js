document.getElementById('requestPasswordResetForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;

    const response = await fetch('http://localhost:7000/api/v1/user/request-password-reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    const result = await response.json();
    alert(result.message);
});
