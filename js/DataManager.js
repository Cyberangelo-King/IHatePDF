const DataManager = (() => {
    let tasks = [];
    let appData = { points: 0, streak: 0, lastCompletionDate: null, unlockedAchievements: [], lastQuoteDate: null, currentQuote: '', hasVisited: false };

    const getTodayString = () => new Date().toISOString().split('T')[0];

    const load = () => {
        try {
            const storedTasks = localStorage.getItem('morningTasks');
            tasks = storedTasks ? JSON.parse(storedTasks) : getDefaultTasks();
            const storedAppData = localStorage.getItem('morningAppData');
            if (storedAppData) appData = JSON.parse(storedAppData);
        } catch (e) { console.error("Error parsing data from localStorage:", e); }
    };

    const save = () => {
        localStorage.setItem('morningTasks', JSON.stringify(tasks));
        localStorage.setItem('morningAppData', JSON.stringify(appData));
    };

    const exportData = () => {
        const dataStr = JSON.stringify({ tasks, appData });
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `power-morning-routine-backup-${getTodayString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const importData = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.tasks && data.appData) {
                    tasks = data.tasks;
                    appData = data.appData;
                    save();
                    // This is a bit tricky, we need to reload the whole app
                    location.reload();
                } else { alert("Invalid data file."); }
            } catch (err) { alert("Error reading file."); console.error(err); }
        };
        reader.readAsText(file);
    };

    const fullReset = () => {
        if (confirm("Are you sure you want to reset everything? This cannot be undone.")) {
            localStorage.removeItem('morningTasks');
            localStorage.removeItem('morningAppData');
            tasks = []; 
            appData = { points: 0, streak: 0, lastCompletionDate: null, unlockedAchievements: [], lastQuoteDate: null, currentQuote: '', hasVisited: true };
            save();
            location.reload();
        }
    };

    const getDefaultTasks = () => [
        { id: 1, title: "Spiritual Foundation", description: "10 min Prayer & Bible study", category: 'home', completed: false },
        { id: 2, title: "Mind & Body Activation", description: "10 min fitness, quick shower", category: 'home', completed: false },
        { id: 3, title: "Creative Flow", description: "15 min poetry/idea journaling", category: 'home', completed: false },
        { id: 4, title: "Prep & Fuel", description: "Breakfast, pack, news headlines", category: 'home', completed: false },
        { id: 5, title: "Academic Excellence", description: "15 min pre-reading for classes", category: 'work', completed: false },
        { id: 6, title: "Skills Development", description: "20 min Python & cybersecurity article", category: 'work', completed: false },
        { id: 7, title: "Business Growth", description: "15 min Web Maven planning", category: 'work', completed: false },
        { id: 8, title: "Brand & Focus", description: "10 min journey documentation & planning", category: 'work', completed: false }
    ];

    const getTasks = () => tasks;
    const getAppData = () => appData;
    const setAppData = (data) => {
        appData = data;
        save();
    };

    const updateTask = (updatedTask) => {
        const taskIndex = tasks.findIndex(t => t.id === updatedTask.id);
        if (taskIndex > -1) {
            tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
            save();
        }
    };

    const deleteTask = (id) => {
        tasks = tasks.filter(t => t.id !== id);
        save();
    };

    const init = () => {
        load();
    };

    return { init, save, exportData, importData, fullReset, getTasks, getAppData, setAppData, updateTask, deleteTask };
})();
