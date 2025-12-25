document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = 'auth/login.html';

    try {
        const data = await API.request('/user/progress');
        renderProgress(data);
    } catch (error) {
        console.error(error);
    }

    function renderProgress(data) {
        // Stats
        document.getElementById('stat-videos').textContent = data.stats.videosWatched;
        document.getElementById('stat-labs').textContent = data.stats.labsCompleted;
        document.getElementById('stat-badges').textContent = data.stats.badgesEarned;

        // Subject Bars
        const progressContainer = document.getElementById('media-progress');
        progressContainer.innerHTML = data.subjects.map(sub => `
            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>${sub.name}</span>
                    <span>${sub.completed}%</span>
                </div>
                <div style="width: 100%; background: rgba(255,255,255,0.1); border-radius: 10px; height: 10px;">
                    <div style="width: ${sub.completed}%; background: ${sub.color}; height: 100%; border-radius: 10px;"></div>
                </div>
            </div>
        `).join('');

        // Badges
        const badgesContainer = document.getElementById('badges-list');
        badgesContainer.innerHTML = data.badges.map(badge => `
            <div style="text-align: center; width: 80px;">
                <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.05); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; border: 1px solid #ffa502;">
                    <i class="fas ${badge.icon}" style="font-size: 1.5rem; color: #ffa502;"></i>
                </div>
                <span style="font-size: 0.8rem; color: var(--text-gray);">${badge.name}</span>
            </div>
        `).join('');
    }
});
