document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = 'auth/login.html';

    const subjectGrid = document.getElementById('subject-grid');
    const classSelection = document.getElementById('class-selection');
    const labList = document.getElementById('lab-list');

    let currentSubject = null;
    let currentClass = null;

    // Load Subjects
    try {
        const subjects = await API.request('/lab/subjects');
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
        labList.style.display = 'block';
        updateH2(`${currentSubject.name} - Class ${classId}`);
        await loadLabs();
    }

    async function loadLabs() {
        try {
            const labs = await API.request(`/lab/${currentSubject.id}/${currentClass}`);
            if (labs.length === 0) {
                labList.innerHTML = '<p class="text-center" style="color: var(--text-gray);">No labs available for this class yet.</p>';
                return;
            }
            // Using full width for simulation
            labList.innerHTML = labs.map(lab => `
                <div class="card" style="margin-bottom: 30px;">
                     <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h3>${lab.title}</h3>
                        <button class="btn btn-primary" onclick="markComplete('${lab.id}')"><i class="fas fa-check-circle"></i> Complete Module</button>
                     </div>
                     <p style="color: var(--text-gray); margin-bottom: 15px;">${lab.description}</p>
                     <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 10px;">
                        <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border:0;" src="${lab.url}" allowfullscreen></iframe>
                     </div>
                </div>
            `).join('');
        } catch (error) {
            console.error(error);
        }
    }

    window.markComplete = async (id) => {
        try {
            const res = await API.request('/lab/complete', 'POST', {
                contentId: id,
                subject: currentSubject.id,
                type: 'lab'
            });

            if (res.success) {
                alert(`Marked lab as complete!`);
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
