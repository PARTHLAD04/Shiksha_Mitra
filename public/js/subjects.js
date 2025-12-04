document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();

    const urlParams = new URLSearchParams(window.location.search);
    const classId = urlParams.get('classId');

    if (!classId) {
        window.location.href = 'modules.html';
        return;
    }

    const container = document.getElementById('subjects-container');

    try {
        const subjects = await fetchAPI(`/content/${classId}/subjects`);

        container.innerHTML = subjects.map(sub => `
            <div class="card" style="cursor: pointer;" onclick="location.href='chapters.html?classId=${classId}&subjectId=${sub._id}'">
                <h3>${sub.name}</h3>
                <p>Click to view chapters</p>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = `<p class="error">${error.message}</p>`;
    }
});
