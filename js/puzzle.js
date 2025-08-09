/**
 * @file Manages the simple puzzle game.
 * @author Angelo
 */

const PuzzleGame = (() => {
    let DOM = {};
    let tiles = [];
    const size = 3;
    let isInitialized = false;

    const createTiles = () => {
        tiles = [];
        for (let i = 1; i < size * size; i++) {
            tiles.push(i);
        }
        tiles.push(null); // Represents the empty tile
    };

    const shuffle = () => {
        // A simple shuffle, might not always be solvable.
        // For a real puzzle, a proper solvable-state shuffle algorithm is needed.
        for (let i = tiles.length - 2; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
        }
    };

    const render = () => {
        if (!isInitialized) return;
        DOM.container.innerHTML = '';
        tiles.forEach((num, index) => {
            const tile = document.createElement('div');
            tile.className = 'puzzle-tile bg-blue-400 dark:bg-blue-700 flex items-center justify-center text-2xl font-bold rounded-md cursor-pointer';
            if (num === null) {
                tile.classList.add('empty', 'bg-gray-200', 'dark:bg-gray-800');
            } else {
                tile.textContent = num;
            }
            tile.addEventListener('click', () => move(index));
            DOM.container.appendChild(tile);
        });
    };

    const move = (index) => {
        const emptyIndex = tiles.indexOf(null);
        const { row, col } = getCoords(index);
        const { row: emptyRow, col: emptyCol } = getCoords(emptyIndex);

        if (
            (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
            (col === emptyCol && Math.abs(row - emptyRow) === 1)
        ) {
            [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
            render();
            checkWin();
        }
    };

    const getCoords = (index) => ({
        row: Math.floor(index / size),
        col: index % size,
    });

    const checkWin = () => {
        for (let i = 0; i < tiles.length - 1; i++) {
            if (tiles[i] !== i + 1) return;
        }
        if (tiles[tiles.length - 1] === null) {
            setTimeout(() => alert('Congratulations! You solved the puzzle!'), 100);
        }
    };

    const reset = () => {
        shuffle();
        render();
    };

    const init = (container, resetBtn) => {
        if (!container || !resetBtn) return;
        DOM = { container, resetBtn };
        isInitialized = true;
        
        DOM.container.style.display = 'grid';
        DOM.resetBtn.style.display = 'block';

        createTiles();
        shuffle();
        render();
        DOM.resetBtn.addEventListener('click', reset);
    };

    return { init };
})();
