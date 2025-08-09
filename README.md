# Power Morning Routine - A Dynamic Routine Planner

**Power Morning Routine** is a sleek, interactive, and feature-rich web application designed to help you build, track, and maintain a powerful morning routine. Built with vanilla HTML, CSS, and JavaScript, this application is a testament to modern web development practices, focusing on a great user experience, robust functionality, and a professional, clean codebase.

## ✨ Features

- **Dynamic Task Management:** Full CRUD (Create, Read, Update, Delete) functionality for your routine tasks.
- **Seamless In-Place Editing:** Click to edit task titles and descriptions directly on the card—no disruptive pop-ups.
- **Drag & Drop Reordering:** Easily organize your routine by dragging and dropping tasks.
- **Advanced Theme Control:** Choose between Light, Dark, and System themes. Your preference is saved locally.
- **Powerful Pomodoro Timer:**
    - **Customizable Sessions:** Set custom durations for work, short breaks, and long breaks.
    - **Visual Progress:** A circular progress bar shows the time remaining.
    - **Automatic Cycles:** The timer automatically cycles through work and break sessions.
    - **Sound Notifications:** Get an audio alert when a session ends.
- **Gamification System:**
    - **Points & Streaks:** Earn points for completing tasks and maintain a daily streak to stay motivated.
    - **Achievements:** Unlock achievements for milestones and celebrate with a confetti effect.
    - **Unlockable Game:** Complete all your daily tasks to unlock a fun puzzle game as a reward.
- **Autocomplete Search:** The task filter now includes an autocomplete feature to help you find tasks quickly.
- **Data Portability:** Export your entire setup (tasks and progress) to a JSON file for backup, and import it on any device.
- **First-Time User Onboarding:** A welcoming guide for new users to get started quickly.
- **Professional UI/UX:**
    - A modern, clean design with a unified color scheme.
    - Fully responsive for a great experience on desktop and mobile.
    - Polished modals and smooth animations.
- **Daily Inspiration:** Get a new motivational quote every day.

## 🛠️ Technologies Used

- **HTML5:** For the core structure and content.
- **Tailwind CSS:** For styling and responsiveness.
- **Vanilla JavaScript (ES6+):** For all application logic, interactivity, and state management. The code is architected using the Module Pattern for clean, maintainable, and scalable code.
- **Tribute.js:** For the autocomplete feature.
- **Font Awesome:** For icons.
- **Google Fonts:** For the "Inter" typeface.
- **canvas-confetti:** For the celebratory achievement effect.

## 🚀 Getting Started

No complex setup is required! Since this is a pure front-end application, you can run it directly in your browser.

1.  **Clone the repository (optional):**
2.  **Open the `index.html` file:**
    - Navigate to the project directory.
    - Double-click the `index.html` file, or open it with your web browser of choice (e.g., by dragging the file into the browser window).

That's it! The application will be running locally in your browser.

## 📦 Pushing to GitHub

To push your project to GitHub, follow these steps:

1.  **Initialize a Git repository:**
    ```bash
    git init
    ```
2.  **Add all files to the staging area:**
    ```bash
    git add .
    ```
3.  **Commit the files:**
    ```bash
    git commit -m "Initial commit"
    ```
4.  **Create a new repository on GitHub.**
5.  **Add the remote repository:**
    ```bash
    git remote add origin <repository-url>
    ```
6.  **Push the files to the repository:**
    ```bash
    git push -u origin main
    ```

## 🏗️ Code Architecture

The JavaScript code is organized using the **Module Pattern** to encapsulate logic and avoid polluting the global namespace. The main `RoutineApp` module is composed of smaller, single-responsibility modules:

-   **`ThemeManager`:** Handles theme switching and persistence.
-   **`DataManager`:** Manages loading from and saving to `localStorage`, as well as data import/export.
-   **`Gamification`:** Controls points, streaks, and achievement logic.
-   **`QuoteManager`:** Manages the daily quote feature.
-   **`TaskManager`:** Handles all CRUD operations for tasks.
-   **`DragDrop`:** Manages the drag-and-drop functionality.
-   **`ModalManager`:** Controls the behavior of all modals.
-   **`TimeManager`:** Updates the date and time display.

This clean architecture makes the code easy to read, debug, and extend.

## 🔒 Security

The application follows client-side security best practices:

-   **Input Sanitization:** All user-provided content (task titles, descriptions) is sanitized before being rendered to the DOM to prevent Cross-Site Scripting (XSS) attacks.
-   **Error Handling:** Data parsing from `localStorage` is wrapped in `try...catch` blocks to gracefully handle potential data corruption.

---

&copy; 2025 Angelo (The Web Maven)
