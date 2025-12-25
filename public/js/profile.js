document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = 'auth/login.html';

    const form = document.getElementById('profile-form');
    const msg = document.getElementById('msg');

    try {
        const user = await API.request('/user/profile');
        renderProfile(user);
    } catch (error) {
        console.error(error);
    }

    function renderProfile(user) {
        document.getElementById('profile-name').textContent = user.name;
        document.getElementById('profile-email').textContent = user.email;
        document.getElementById('profile-joined').textContent = `Joined: ${new Date(user.joinedDate).toLocaleDateString()}`;

        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        try {
            const data = await API.request('/user/profile', 'PUT', { name, email });
            // API.request returns the parsed JSON

            if (data._id) {
                // Update local storage
                localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email })); // Keep simple
                renderProfile({ ...data, joinedDate: new Date() }); // Mock date or refresh
                msg.textContent = 'Profile updated successfully!';
                msg.style.color = '#2ed573';
                msg.style.display = 'block';
                setTimeout(() => msg.style.display = 'none', 3000);
            }
        } catch (error) {
            msg.textContent = 'Error updating profile';
            msg.style.color = '#ff4757';
            msg.style.display = 'block';
        }
    });

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    }
});
