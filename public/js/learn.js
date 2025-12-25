document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = 'auth/login.html';

    const subjectGrid = document.getElementById('subject-grid');
    const classSelection = document.getElementById('class-selection');
    const videoList = document.getElementById('video-list');
    const bcrumb = document.getElementById('bcrumb');

    let currentSubject = null;
    let currentClass = null;

    // Load Subjects
    try {
        const subjects = await API.request('/learn/subjects');
        renderSubjects(subjects);
    } catch (error) {
        console.error(error);
    }

    function renderSubjects(subjects) {
        subjectGrid.innerHTML = subjects.map(sub => `
            <div class="card" onclick="selectSubject('${sub.id}', '${sub.name}')" style="cursor: pointer; text-align: center;">
                <div style="font-size: 3rem; color: ${sub.color}; margin-bottom: 20px;">
                    <i class="fas ${sub.icon}"></i>
                </div>
                <h3>${sub.name}</h3>
            </div>
        `).join('');
    }

    window.selectSubject = (id, name) => {
        currentSubject = { id, name };
        subjectGrid.style.display = 'none';
        classSelection.style.display = 'grid';
        updateH2(`Select Class for ${name}`);
        updateBreadcrumb(name);
    }

    // Render Classes (1-10)
    const classes = Array.from({ length: 10 }, (_, i) => i + 1);
    classSelection.innerHTML = classes.map(c => `
        <div class="card" onclick="selectClass(${c})" style="cursor: pointer; text-align: center; padding: 30px;">
            <h3>Class ${c}</h3>
        </div>
    `).join('');

    window.selectClass = async (classId) => {
        currentClass = classId;
        classSelection.style.display = 'none';
        videoList.style.display = 'block';
        updateH2(`${currentSubject.name} - Class ${classId}`);
        updateBreadcrumb(currentSubject.name, `Class ${classId}`);
        await loadVideos();
    }

    async function loadVideos() {
        try {
            const videos = await API.request(`/learn/${currentSubject.id}/${currentClass}`);
            if (videos.length === 0) {
                videoList.innerHTML = '<p class="text-center" style="color: var(--text-gray);">No videos available for this class yet.</p>';
                return;
            }
            videoList.innerHTML = videos.map(vid => `
                <div class="video-card card" style="display: flex; gap: 20px; align-items: start; margin-bottom: 20px;">
                     <iframe width="200" height="120" src="${vid.url}" frameborder="0" allowfullscreen style="border-radius: 10px;"></iframe>
                     <div style="flex: 1;">
                        <h3>${vid.title}</h3>
                        <p style="color: var(--text-gray); margin-bottom: 10px;">Duration: ${vid.duration}</p>
                        <button class="btn btn-primary" style="padding: 8px 20px; font-size: 0.9rem;" onclick="markComplete('${vid.id}')">
                            <i class="fas fa-check-circle"></i> Mark as Done
                        </button>
                     </div>
                </div>
            `).join('');
        } catch (error) {
            console.error(error);
        }
    }

    window.markComplete = async (vidId) => {
        console.log("DataTransfer", vidId)
        try {
            const res = await API.request('/learn/complete', 'POST', {
                contentId: vidId,
                subject: currentSubject.id,
                type: 'video'
            });

            if (res.success) {
                alert(`Marked video as complete!`);
                if (res.badges && res.badges.length > 0) {
                    alert(`Congrats! You earned new badges: ${res.badges.join(', ')}`);
                }
            }
        } catch (error) {
            console.error(error);
            alert('Error updating progress');
        }
    }

    function updateH2(text) {
        document.getElementById('page-title').textContent = text;
    }

    function updateBreadcrumb(subject, cls) {
        let html = '<span onclick="reset()" style="cursor: pointer; color: var(--text-gray);">Subjects</span>';
        if (subject) html += ` / <span style="color: var(--primary);">${subject}</span>`;
        if (cls) html += ` / <span style="color: var(--primary);">${cls}</span>`;
        // bcrumb.innerHTML = html; // Optional breadcrumb implementation
    }

    window.reset = () => {
        // Simple reload for now to go back
        window.location.reload();
    }
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
