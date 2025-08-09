/**
 * @file Manages the enhanced Pomodoro timer functionality.
 * @author Angelo
 */

const PomodoroTimer = (() => {
    let DOM = {};
    let timer;
    let timeRemaining;
    let isPaused = true;
    let state = {
        mode: 'work', // 'work', 'shortBreak', 'longBreak'
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sessionsBeforeLongBreak: 4,
        sessionCount: 0
    };
    const notificationSound = new Audio('https://www.soundjay.com/buttons/sounds/button-16.mp3');

    const createTimerUI = () => {
        const container = document.getElementById('pomodoro-section');
        if (!container) return;

        container.innerHTML = `
            <div class="relative w-48 h-48 mx-auto mb-4">
                <svg class="w-full h-full" viewBox="0 0 100 100">
                    <circle class="text-gray-200 dark:text-gray-700" stroke-width="10" cx="50" cy="50" r="45" fill="transparent"></circle>
                    <circle id="pomodoro-progress" class="text-green-500" stroke-width="10" cx="50" cy="50" r="45" fill="transparent" stroke-linecap="round" transform="rotate(-90 50 50)" style="stroke-dasharray: 283; stroke-dashoffset: 283;"></circle>
                </svg>
                <div id="pomodoro-time" class="absolute inset-0 flex items-center justify-center text-3xl font-bold"></div>
            </div>
            <div id="pomodoro-status" class="text-center text-lg font-semibold mb-4"></div>
            <div class="flex justify-center space-x-2">
                <button id="pomodoro-start" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"><i class="fas fa-play"></i></button>
                <button id="pomodoro-pause" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"><i class="fas fa-pause"></i></button>
                <button id="pomodoro-reset" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"><i class="fas fa-sync-alt"></i></button>
            </div>
            <div class="mt-4 text-center">
                <button id="pomodoro-mode-work" class="px-3 py-1 text-sm rounded-lg">Work</button>
                <button id="pomodoro-mode-short" class="px-3 py-1 text-sm rounded-lg">Short Break</button>
                <button id="pomodoro-mode-long" class="px-3 py-1 text-sm rounded-lg">Long Break</button>
            </div>
        `;

        DOM = {
            timeDisplay: document.getElementById('pomodoro-time'),
            progress: document.getElementById('pomodoro-progress'),
            status: document.getElementById('pomodoro-status'),
            startBtn: document.getElementById('pomodoro-start'),
            pauseBtn: document.getElementById('pomodoro-pause'),
            resetBtn: document.getElementById('pomodoro-reset'),
            modeButtons: {
                work: document.getElementById('pomodoro-mode-work'),
                short: document.getElementById('pomodoro-mode-short'),
                long: document.getElementById('pomodoro-mode-long')
            }
        };
    };

    const updateDisplay = () => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        DOM.timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        const totalDuration = state[`${state.mode}Duration`] * 60;
        const progressOffset = 283 * (1 - timeRemaining / totalDuration);
        DOM.progress.style.strokeDashoffset = progressOffset;
    };
    
    const updateStatus = () => {
        const modeText = {
            work: 'Focus on your task',
            shortBreak: 'Time for a short break',
            longBreak: 'Take a long break'
        };
        DOM.status.textContent = modeText[state.mode];

        Object.values(DOM.modeButtons).forEach(btn => btn.classList.remove('bg-blue-500', 'text-white'));
        const activeBtn = DOM.modeButtons[state.mode === 'work' ? 'work' : (state.mode === 'shortBreak' ? 'short' : 'long')];
        if(activeBtn) activeBtn.classList.add('bg-blue-500', 'text-white');
    };

    const switchMode = (newMode) => {
        pause();
        state.mode = newMode;
        timeRemaining = state[`${state.mode}Duration`] * 60;
        updateDisplay();
        updateStatus();
    };

    const start = () => {
        if (isPaused) {
            isPaused = false;
            DOM.startBtn.disabled = true;
            DOM.pauseBtn.disabled = false;
            timer = setInterval(() => {
                if (timeRemaining > 0) {
                    timeRemaining--;
                    updateDisplay();
                } else {
                    handleSessionEnd();
                }
            }, 1000);
        }
    };

    const pause = () => {
        isPaused = true;
        DOM.startBtn.disabled = false;
        DOM.pauseBtn.disabled = true;
        clearInterval(timer);
    };

    const reset = () => {
        pause();
        timeRemaining = state[`${state.mode}Duration`] * 60;
        updateDisplay();
    };

    const handleSessionEnd = () => {
        notificationSound.play();
        if (state.mode === 'work') {
            state.sessionCount++;
            if (state.sessionCount % state.sessionsBeforeLongBreak === 0) {
                switchMode('longBreak');
            } else {
                switchMode('shortBreak');
            }
        } else {
            switchMode('work');
        }
        // Automatically start the next session
        start();
    };

    const init = () => {
        createTimerUI();
        if (!DOM.timeDisplay) {
            console.error('Pomodoro timer UI could not be created.');
            return;
        }

        DOM.startBtn.addEventListener('click', start);
        DOM.pauseBtn.addEventListener('click', pause);
        DOM.resetBtn.addEventListener('click', reset);
        DOM.modeButtons.work.addEventListener('click', () => switchMode('work'));
        DOM.modeButtons.short.addEventListener('click', () => switchMode('shortBreak'));
        DOM.modeButtons.long.addEventListener('click', () => switchMode('longBreak'));

        switchMode('work');
        pause(); // Start in a paused state
    };

    return { init };
})();
