const ModalManager = (() => {
    const DOM = {
        modals: document.querySelectorAll('.modal'),
        achievementsModal: { root: document.getElementById('achievements-modal'), list: document.getElementById('achievements-list') },
    };

    let activeModal = null;

    const sanitize = (str) => {
        if (!str) return '';
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    };

    const toggle = (modalId, show) => {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        if (show) {
            activeModal = modal;
            modal.classList.remove('hidden');
            // Delay to allow the display property to apply before starting the transition
            setTimeout(() => modal.classList.add('visible'), 10);
            if (modalId === 'achievements-modal') renderAchievements();
        } else {
            activeModal = null;
            modal.classList.remove('visible');
            // Wait for the transition to finish before hiding
            setTimeout(() => modal.classList.add('hidden'), 300);
        }
    };

    const renderAchievements = () => {
        const appData = DataManager.getAppData();
        const ACHIEVEMENTS = Gamification.getAchievements();
        if (!DOM.achievementsModal.list) return;
        DOM.achievementsModal.list.innerHTML = '';
        ACHIEVEMENTS.forEach(ach => {
            const isUnlocked = appData.unlockedAchievements.includes(ach.id);
            const li = document.createElement('li');
            li.className = `flex items-center p-3 rounded-lg ${isUnlocked ? 'bg-green-100 dark:bg-green-900/50' : 'bg-gray-100 dark:bg-gray-700/50'}`;
            li.innerHTML = `
                <i class="fas fa-trophy text-2xl mr-4 ${isUnlocked ? 'text-yellow-500' : 'text-gray-400'}"></i>
                <div>
                    <strong class="text-gray-800 dark:text-white">${sanitize(ach.title)} (+${ach.points} pts)</strong>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${sanitize(ach.description)}</p>
                </div>
            `;
            DOM.achievementsModal.list.appendChild(li);
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape' && activeModal) {
            toggle(activeModal.id, false);
        }
    };

    const showConfirmation = (title, message, onConfirm) => {
        document.getElementById('confirmation-title').textContent = title;
        document.getElementById('confirmation-message').textContent = message;

        const confirmBtn = document.getElementById('confirm-btn');
        const cancelBtn = document.getElementById('cancel-btn');

        const confirmHandler = () => {
            onConfirm();
            toggle('confirmation-modal', false);
            cleanup();
        };

        const cancelHandler = () => {
            toggle('confirmation-modal', false);
            cleanup();
        };

        const cleanup = () => {
            confirmBtn.removeEventListener('click', confirmHandler);
            cancelBtn.removeEventListener('click', cancelHandler);
        };

        confirmBtn.addEventListener('click', confirmHandler);
        cancelBtn.addEventListener('click', cancelHandler);

        toggle('confirmation-modal', true);
    };

    const init = () => {
        DOM.modals.forEach(modal => {
            const closeBtn = modal.querySelector('.close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => toggle(modal.id, false));
            }
            // Close modal on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    toggle(modal.id, false);
                }
            });
        });

        document.addEventListener('keydown', handleKeyDown);
    };

    return { init, toggle, showConfirmation };
})();
