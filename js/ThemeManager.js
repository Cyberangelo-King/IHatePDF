const ThemeManager = (() => {
    const DOM = {
        themeToggle: document.getElementById('theme-toggle'),
    };

    const handle = () => set(localStorage.getItem('theme') || 'system');
    
    const set = (theme) => {
        const icon = DOM.themeToggle.querySelector('i');
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            if (icon) icon.className = 'fas fa-sun';
        } else {
            document.documentElement.classList.remove('dark');
            if (icon) icon.className = 'fas fa-moon';
        }
        localStorage.setItem('theme', theme);
    };

    const cycle = () => {
        const themes = ['light', 'dark', 'system'];
        const currentTheme = localStorage.getItem('theme') || 'system';
        set(themes[(themes.indexOf(currentTheme) + 1) % themes.length]);
    };

    const init = () => {
        DOM.themeToggle.addEventListener('click', cycle);
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handle);
        handle();
    };

    return { init, cycle, handle };
})();
