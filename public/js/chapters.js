document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();

    const urlParams = new URLSearchParams(window.location.search);
    const classId = urlParams.get('classId');
    const subjectId = urlParams.get('subjectId');

    if (!classId || !subjectId) {
        window.location.href = 'modules.html';
        return;
    }

    const container = document.getElementById('chapters-container');

    try {
        const chapters = await fetchAPI(`/content/${classId}/subjects/${subjectId}/chapters`);

        container.innerHTML = chapters.map((chap, index) => `
            <div class="card" style="cursor: pointer;" onclick="location.href='learn.html?classId=${classId}&subjectId=${subjectId}&chapterId=${chap._id}'">
                <h3>${chap.title}</h3>
                <p>Start Learning</p>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = `<p class="error">${error.message}</p>`;
    }
});
