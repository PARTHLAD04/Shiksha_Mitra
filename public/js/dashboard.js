document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();

    const userStr = localStorage.getItem('user');
    const user = JSON.parse(userStr);

    document.getElementById('user-name').textContent = user.name;

    // Load fresh user data for points
    try {
        const profile = await fetchAPI('/users/me');
        document.getElementById('total-points').textContent = profile.totalPoints;
        document.getElementById('modules-completed').textContent = profile.modulesCompleted;
    } catch (error) {
        console.error(error);
    }

    document.getElementById('logout-btn').addEventListener('click', logout);
});
