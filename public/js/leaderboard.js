document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();

    const tbody = document.getElementById('leaderboard-body');

    try {
        const users = await fetchAPI('/users/leaderboard');

        tbody.innerHTML = users.map((user, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${user.name}</td>
                <td>${user.modulesCompleted}</td>
                <td style="font-weight: 700; color: var(--primary-color);">${user.totalPoints}</td>
            </tr>
        `).join('');
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="4" class="error">${error.message}</td></tr>`;
    }
});
