/**
 * @file Main script for the Power Morning Routine application.
 * @author Angelo
 * @version MVP 1.0.0
 */

const RoutineApp = (() => {
    // --- STATE & CONSTANTS ---
    let tasks = [];
    let appData = { points: 0, streak: 0, lastCompletionDate: null, unlockedAchievements: [], lastQuoteDate: null, currentQuote: '', hasVisited: false };
    const ACHIEVEMENTS = [
        { id: 'first_task', title: 'First Step', description: 'Complete your first task.', points: 5 },
        { id: 'full_day', title: 'Routine Master', description: 'Complete all tasks in a day.', points: 20 },
        { id: 'streak_3', title: 'On a Roll', description: 'Maintain a 3-day streak.', points: 50 },
        { id: 'streak_7', title: 'Week of Power', description: 'Maintain a 7-day streak.', points: 100 },
        { id: 'add_task', title: 'Customizer', description: 'Add your first custom task.', points: 10 }
    ];
    const QUOTES = [ "The secret of your future is hidden in your daily routine.", "The sun is a daily reminder that we too can rise again from the darkness.", "With the new day comes new strength and new thoughts.", "Your morning sets up the success of your day.", "Success is the sum of small efforts, repeated day in and day out." ];
    const DOM = {
        themeToggle: document.getElementById('theme-toggle'),
        homeSection: document.getElementById('home-section'),
        workSection: document.getElementById('work-section'),
        progressFill: document.getElementById('progressFill'),
        subtitle: document.getElementById('subtitle'),
        streakCount: document.getElementById('streak-count'),
        pointsCount: document.getElementById('points-count'),
        achievementsBtn: document.getElementById('achievements-btn'),
        settingsBtn: document.getElementById('settings-btn'),
        connectBtn: document.getElementById('connect-btn'),
        searchBar: document.getElementById('search-bar'),
        time: document.getElementById('time'),
        date: document.getElementById('date'),
        // Modals
        modals: document.querySelectorAll('.modal'),
        achievementsModal: { root: document.getElementById('achievements-modal'), list: document.getElementById('achievements-list') },
        settingsModal: { root: document.getElementById('settings-modal'), exportBtn: document.getElementById('export-btn'), importFile: document.getElementById('import-file'), resetAppBtn: document.getElementById('reset-app-btn') },
        welcomeModal: { root: document.getElementById('welcome-modal'), gotItBtn: document.getElementById('close-welcome-btn') },
        addTaskModal: { root: document.getElementById('add-task-modal'), form: document.getElementById('add-task-form'), title: document.getElementById('new-task-title'), desc: document.getElementById('new-task-desc'), category: document.getElementById('new-task-category') },
        connectModal: { root: document.getElementById('connect-modal') },
        resetBtn: document.querySelector('.reset')
    };

    // --- UTILS ---
    const sanitize = (str) => { if (!str) return ''; const temp = document.createElement('div'); temp.textContent = str; return temp.innerHTML; };
    const getTodayString = () => new Date().toISOString().split('T')[0];

    // --- CORE MODULES ---








    const Autocomplete = (() => {
        let tribute;
        const init = (inputElement) => {
            tribute = new Tribute({
                values: (text, cb) => {
                    const matchingTasks = tasks.filter(task => task.title.toLowerCase().includes(text.toLowerCase()));
                    cb(matchingTasks.map(task => ({ key: task.title, value: task.title })));
                },
                selectTemplate: (item) => {
                    if (typeof item === 'undefined') return null;
                    return item.original.value;
                },
                menuItemTemplate: (item) => {
                    return item.string;
                },
                noMatchTemplate: () => {
                    return '<li class="no-match">No matches found</li>';
                }
            });
            tribute.attach(inputElement);
        };
        return { init };
    })();

    // --- INITIALIZATION ---
    const init = () => {
        // Main Controls
        document.getElementById('add-task-btn').addEventListener('click', () => ModalManager.toggle('add-task-modal', true));
        DOM.themeToggle.addEventListener('click', ThemeManager.cycle);
        DOM.resetBtn.addEventListener('click', TaskManager.resetDay);
        DOM.achievementsBtn.addEventListener('click', () => ModalManager.toggle('achievements-modal', true));
        DOM.settingsBtn.addEventListener('click', () => ModalManager.toggle('settings-modal', true));
        DOM.connectBtn.addEventListener('click', () => ModalManager.toggle('connect-modal', true));
        
        // All Modals - Close buttons
        DOM.modals.forEach(modal => {
            const closeBtn = modal.querySelector('.close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => ModalManager.toggle(modal.id, false));
            }
        });
        
        // Specific Modal Buttons
        DOM.settingsModal.exportBtn.addEventListener('click', DataManager.exportData);
        DOM.settingsModal.importFile.addEventListener('change', DataManager.importData);
        DOM.settingsModal.resetAppBtn.addEventListener('click', DataManager.fullReset);
        DOM.welcomeModal.gotItBtn.addEventListener('click', () => { ModalManager.toggle('welcome-modal', false); appData.hasVisited = true; DataManager.save(); });
        DOM.addTaskModal.form.addEventListener('submit', (e) => {
            e.preventDefault();
            TaskManager.add(DOM.addTaskModal.title.value, DOM.addTaskModal.desc.value, DOM.addTaskModal.category.value);
            DOM.addTaskModal.form.reset();
            ModalManager.toggle('add-task-modal', false);
        });

        DOM.searchBar.addEventListener('input', (e) => TaskManager.render(e.target.value));
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ThemeManager.handle);
        
        DragDrop.init();
        DataManager.load();
        ThemeManager.handle();
        TimeManager.update();
        setInterval(TimeManager.update, 60000);
        Autocomplete.init(DOM.searchBar);
    };

    return { start: init };
})();

document.addEventListener('DOMContentLoaded', RoutineApp.start);
