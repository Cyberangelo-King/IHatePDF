const Gamification = (() => {
    let puzzleInitialized = false;
    const ACHIEVEMENTS = [
        { id: 'first_task', title: 'First Step', description: 'Complete your first task.', points: 5 },
        { id: 'full_day', title: 'Routine Master', description: 'Complete all tasks in a day.', points: 20 },
        { id: 'streak_3', title: 'On a Roll', description: 'Maintain a 3-day streak.', points: 50 },
        { id: 'streak_7', title: 'Week of Power', description: 'Maintain a 7-day streak.', points: 100 },
        { id: 'add_task', title: 'Customizer', description: 'Add your first custom task.', points: 10 }
    ];

    const DOM = {
        streakCount: document.getElementById('streak-count'),
        pointsCount: document.getElementById('points-count'),
    };

    const getTodayString = () => new Date().toISOString().split('T')[0];

    const checkAndUnlockPuzzle = () => {
        const puzzleContainer = document.getElementById('puzzle-container');
        const puzzleResetBtn = document.getElementById('puzzle-reset');
        const rewardsMessage = document.getElementById('rewards-message');
        const tasks = DataManager.getTasks();

        if (tasks.length > 0 && tasks.every(t => t.completed)) {
            if (!puzzleInitialized) {
                rewardsMessage.classList.add('hidden');
                PuzzleGame.init(puzzleContainer, puzzleResetBtn);
                puzzleInitialized = true;
            }
        } else {
            rewardsMessage.classList.remove('hidden');
            if(puzzleContainer) puzzleContainer.style.display = 'none';
            if(puzzleResetBtn) puzzleResetBtn.style.display = 'none';
            puzzleInitialized = false;
        }
    };

    const unlockAchievement = (id) => {
        const appData = DataManager.getAppData();
        if (!appData.unlockedAchievements.includes(id)) {
            const achievement = ACHIEVEMENTS.find(a => a.id === id);
            if (!achievement) return;
            appData.unlockedAchievements.push(id);
            appData.points += achievement.points;
            alert(`Achievement Unlocked: ${achievement.title} (+${achievement.points} points)`);
            if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            updatePointsDisplay();
            DataManager.save();
        }
    };

    const updateStreak = () => {
        const appData = DataManager.getAppData();
        const todayStr = getTodayString();
        if (appData.lastCompletionDate) {
            const lastDate = new Date(appData.lastCompletionDate);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastDate.toISOString().split('T')[0] !== todayStr && lastDate.toISOString().split('T')[0] !== yesterday.toISOString().split('T')[0]) {
                appData.streak = 0;
                DataManager.save();
            }
        }
        if (DOM.streakCount) DOM.streakCount.textContent = appData.streak;
    };

    const checkAchievements = () => {
        const tasks = DataManager.getTasks();
        const appData = DataManager.getAppData();
        if (tasks.some(t => t.completed)) unlockAchievement('first_task');
        if (tasks.length > 0 && tasks.every(t => t.completed)) {
            unlockAchievement('full_day');
            const todayStr = getTodayString();
            if (appData.lastCompletionDate !== todayStr) {
                appData.streak++;
                appData.lastCompletionDate = todayStr;
                updateStreak();
                DataManager.save();
            }
        }
        if (appData.streak >= 3) unlockAchievement('streak_3');
        if (appData.streak >= 7) unlockAchievement('streak_7');
        checkAndUnlockPuzzle();
    };

    const updatePointsDisplay = () => {
        const appData = DataManager.getAppData();
        if (DOM.pointsCount) DOM.pointsCount.textContent = appData.points;
    };

    const init = () => {
        updateStreak();
        updatePointsDisplay();
    };

    return { init, unlockAchievement, checkAchievements, updatePointsDisplay, checkAndUnlockPuzzle };
})();
