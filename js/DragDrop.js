const DragDrop = (() => {
    let draggedItem = null;

    const add = (el) => {
        el.addEventListener('dragstart', (e) => { 
            draggedItem = e.target.closest('.task-item');
            setTimeout(() => draggedItem.classList.add('dragging'), 0); 
        });
        el.addEventListener('dragend', () => {
            setTimeout(() => {
                if (draggedItem) draggedItem.classList.remove('dragging');
                draggedItem = null;
                const tasks = DataManager.getTasks();
                const newOrder = Array.from(document.querySelectorAll('.task-item')).map(block => tasks.find(t => t.id == block.dataset.id));
                // A bit of a hack to update the tasks array in DataManager
                DataManager.getAppData().tasks = newOrder.filter(Boolean);
                DataManager.save();
            }, 0);
        });
    };

    const init = () => {
        [document.getElementById('home-section'), document.getElementById('work-section')].forEach(section => {
            if (!section) return;
            section.addEventListener('dragover', e => {
                e.preventDefault();
                if (!draggedItem) return;
                const afterElement = [...section.querySelectorAll('.task-item:not(.dragging)')].reduce((closest, child) => {
                    const box = child.getBoundingClientRect();
                    const offset = e.clientY - box.top - box.height / 2;
                    return (offset < 0 && offset > closest.offset) ? { offset, element: child } : closest;
                }, { offset: Number.NEGATIVE_INFINITY }).element;
                if (afterElement == null) section.appendChild(draggedItem);
                else section.insertBefore(draggedItem, afterElement);
            });
        });
    };

    return { add, init };
})();
