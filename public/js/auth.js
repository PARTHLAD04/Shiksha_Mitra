// Handle Registration
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const data = await fetchAPI('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password })
            });

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            window.location.href = 'dashboard.html';
        } catch (error) {
            alert(error.message);
        }
    });
}

// Handle Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const data = await fetchAPI('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            window.location.href = 'dashboard.html';
        } catch (error) {
            alert(error.message);
        }
    });
}
