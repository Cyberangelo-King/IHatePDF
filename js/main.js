document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    DataManager.init();
    ThemeManager.init();
    TimeManager.init();
    QuoteManager.init();
    TaskManager.init();
    DragDrop.init();
    Gamification.init();
    ModalManager.init();
    PomodoroTimer.init();

    // Event Listeners
    document.getElementById('add-task-btn').addEventListener('click', () => ModalManager.toggle('add-task-modal', true));
    document.getElementById('settings-btn').addEventListener('click', () => ModalManager.toggle('settings-modal', true));
    document.getElementById('achievements-btn').addEventListener('click', () => ModalManager.toggle('achievements-modal', true));
    document.getElementById('connect-btn').addEventListener('click', () => ModalManager.toggle('connect-modal', true));
    document.getElementById('edit-task-form').addEventListener('submit', TaskManager.handleEditSubmit);

    // Welcome modal logic
    const appData = DataManager.getAppData();
    if (!appData.returningUser) {
        ModalManager.toggle('welcome-modal', true);
        appData.returningUser = true;
        DataManager.setAppData(appData);
    }
});
