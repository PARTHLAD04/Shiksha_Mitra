document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();

    const container = document.getElementById('classes-container');

    try {
        const classes = await fetchAPI('/content/classes');

        container.innerHTML = classes.map(cls => `
            <div class="card" style="cursor: pointer;" onclick="location.href='subjects.html?classId=${cls._id}'">
                <h3>${cls.level}</h3>
                <p>Click to view subjects</p>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = `<p class="error">${error.message}</p>`;
    }
});
