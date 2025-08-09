const TaskManager = (() => {
    const DOM = {
        homeSection: document.getElementById('home-section'),
        workSection: document.getElementById('work-section'),
        progressFill: document.getElementById('progressFill'),
        searchBar: document.getElementById('search-bar'),
    };

    const sanitize = (str) => {
        if (!str) return '';
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    };

    const render = (filter = '') => {
        const tasks = DataManager.getTasks();
        const renderTask = (task) => {
            const section = task.category === 'home' ? DOM.homeSection : DOM.workSection;
            if (section) section.appendChild(createTaskElement(task));
        };
        if (DOM.homeSection) DOM.homeSection.innerHTML = '';
        if (DOM.workSection) DOM.workSection.innerHTML = '';
        
        const lowerCaseFilter = filter.toLowerCase();
        tasks.filter(t => t.title.toLowerCase().includes(lowerCaseFilter) || t.description.toLowerCase().includes(lowerCaseFilter)).forEach(renderTask);
        
        updateProgress();
        DataManager.save();
    };

    const createTaskElement = (task) => {
        const div = document.createElement('div');
        div.className = `task-item p-4 rounded-lg shadow-md mb-3 flex justify-between items-start cursor-pointer transition-all duration-200 ${task.completed ? 'bg-green-100 dark:bg-green-900/50' : 'bg-white dark:bg-gray-800'}`;
        div.dataset.id = task.id;
        div.draggable = true;
        div.innerHTML = `
            <div class="flex items-start flex-grow">
                <i class="fas fa-check-circle mr-4 mt-1 ${task.completed ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}"></i>
                <div class="flex-grow">
                    <div class="font-bold text-lg text-gray-800 dark:text-white">${sanitize(task.title)}</div>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">${sanitize(task.description).replace(/\n/g, '<br>')}</p>
                </div>
            </div>
            <div class="flex items-center space-x-1 ml-2">
                <button class="edit-btn p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="delete-btn p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        `;
        addEventListeners(div, task);
        return div;
    };

    const addEventListeners = (el, task) => {
        DragDrop.add(el);
        el.addEventListener('click', e => { 
            if (!e.target.closest('button')) {
                toggleComplete(task.id);
            }
        });
        el.querySelector('.edit-btn').addEventListener('click', (e) => { e.stopPropagation(); edit(task.id); });
        el.querySelector('.delete-btn').addEventListener('click', (e) => { e.stopPropagation(); remove(task.id); });
    };

    const toggleComplete = (id) => {
        const tasks = DataManager.getTasks();
        const task = tasks.find(t => t.id === id);
        if (!task) return;
        if (!task.completed) {
            const appData = DataManager.getAppData();
            appData.points += 1;
            Gamification.updatePointsDisplay();
        }
        task.completed = !task.completed;
        Gamification.checkAchievements();
        render(DOM.searchBar.value);
    };

    const add = (title, description, category) => {
        const tasks = DataManager.getTasks();
        tasks.push({ id: Date.now(), title, description, category, completed: false });
        Gamification.unlockAchievement('add_task');
        render();
    };

    const edit = (id) => {
        const task = DataManager.getTasks().find(t => t.id === id);
        if (!task) return;

        document.getElementById('edit-task-id').value = task.id;
        document.getElementById('edit-task-title').value = task.title;
        document.getElementById('edit-task-desc').value = task.description;
        document.getElementById('edit-task-category').value = task.category;

        ModalManager.toggle('edit-task-modal', true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const id = parseInt(document.getElementById('edit-task-id').value);
        const title = document.getElementById('edit-task-title').value;
        const description = document.getElementById('edit-task-desc').value;
        const category = document.getElementById('edit-task-category').value;

        DataManager.updateTask({ id, title, description, category });
        render(DOM.searchBar.value);
        ModalManager.toggle('edit-task-modal', false);
    };

    const remove = (id) => {
        ModalManager.showConfirmation(
            'Delete Task',
            'Are you sure you want to delete this task?',
            () => {
                DataManager.deleteTask(id);
                render(DOM.searchBar.value);
            }
        );
    };

    const updateProgress = () => {
        const tasks = DataManager.getTasks();
        const completed = tasks.filter(t => t.completed).length;
        const total = tasks.length;
        const progress = total > 0 ? (completed / total) * 100 : 0;
        if (DOM.progressFill) DOM.progressFill.style.width = `${progress}%`;
        Gamification.checkAndUnlockPuzzle();
    };

    const resetDay = () => {
        const tasks = DataManager.getTasks();
        tasks.forEach(t => t.completed = false);
        render(DOM.searchBar.value);
    };

    const init = () => {
        render();
        DOM.searchBar.addEventListener('input', (e) => render(e.target.value));
    };

    return { init, add, resetDay, handleEditSubmit };
})();
