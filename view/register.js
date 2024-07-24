document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        userName: document.getElementById('userName').value,
        password: document.getElementById('password').value
    };

    
    try {
        const response = await fetch('http://localhost:7000/api/v1/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData) 
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'An error occurred');
        }

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        alert('Error: ' + error.message);
    }
});
