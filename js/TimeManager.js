const TimeManager = (() => {
    const DOM = {
        time: document.getElementById('time'),
        date: document.getElementById('date'),
    };

    const update = () => {
        const now = new Date();
        if (DOM.time) DOM.time.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (DOM.date) DOM.date.textContent = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
    };

    const init = () => {
        update();
        setInterval(update, 60000);
    };

    return { init };
})();
