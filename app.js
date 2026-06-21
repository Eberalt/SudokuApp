const boardElement = document.getElementById('board');
const difficultySelect = document.getElementById('difficulty-select');
const TOTAL_FILES_BY_DIFFICULTY = {
    easy: 3100,       
    medium: 3640,     
    hard: 2057,       
    very_hard: 205    
};
let selectedCell = null;

async function fetchSudokuBoard(difficulty = 'easy') {
    try {
        const randomFileNumber = Math.floor(Math.random() * TOTAL_PUZZLE_FILES);
        
        const response = await fetch(`./puzzles/${difficulty}/${randomFileNumber}.json`);
        const puzzlesPool = await response.json();
        
        const randomIndex = Math.floor(Math.random() * puzzlesPool.length);
        const puzzleString = puzzlesPool[randomIndex];
        
        return puzzleString;
    } catch (error) {
        console.error("Błąd podczas dynamicznego pobierania partii plansz:", error);
        return null;
    }
}

async function createBoard() {
    boardElement.innerHTML = '';
    
    const selectedDifficulty = difficultySelect.value;
    
    const boardMatrix = await fetchSudokuBoard(selectedDifficulty);
    if (!boardMatrix) return;

    let index = 0;
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.dataset.index = index;

            const value = boardMatrix[r][c];
            cell.innerText = value === 0 ? '' : value;
            
            if (value !== 0) {
                cell.classList.add('starting-cell');
            } else {
                cell.addEventListener('click', () => {
                    if (selectedCell) {
                        selectedCell.classList.remove('selected');
                    }
                    selectedCell = cell;
                    cell.classList.add('selected');
                });
            }

            boardElement.appendChild(cell);
            index++;
        }
    }
}

addEventListener("DOMContentLoaded", (event) => { createBoard() });

function checkErrors() {
    const allCells = document.querySelectorAll('.cell');
    
    allCells.forEach(cell => cell.classList.remove('error'));

    allCells.forEach(currentCell => {
        const val = currentCell.innerText;
        if (val === '') return;

        const currentRow = parseInt(currentCell.dataset.row);
        const currentCol = parseInt(currentCell.dataset.col);
        const currentIndex = parseInt(currentCell.dataset.index);

        allCells.forEach(otherCell => {
            const otherVal = otherCell.innerText;
            const otherRow = parseInt(otherCell.dataset.row);
            const otherCol = parseInt(otherCell.dataset.col);
            const otherIndex = parseInt(otherCell.dataset.index);

            // Ignorujemy porównywanie komórki samej ze sobą
            if (currentIndex === otherIndex) return;

            if (val === otherVal) {
                // 1. Ten sam wiersz
                const sameRow = (currentRow === otherRow);
                // 2. Ta sama kolumna
                const sameCol = (currentCol === otherCol);
                // 3. Ten sam kwadrat 3x3
                const sameBox = (Math.floor(currentRow / 3) === Math.floor(otherRow / 3) && 
                                 Math.floor(currentCol / 3) === Math.floor(otherCol / 3));

                if (sameRow || sameCol || sameBox) {
                    currentCell.classList.add('error');
                    otherCell.classList.add('error'); // Podświetlamy obie skonfliktowane komórki
                }
            }
        });
    });
    checkWin();
}

const keys = document.querySelectorAll('.key-btn');

keys.forEach(key => {
    key.addEventListener('click', () => {
        if (!selectedCell) return;

        if (key.id === 'clear-btn') {
            selectedCell.innerText = '';
        } else {
            selectedCell.innerText = key.innerText;
        }
    });
    key.addEventListener('click', () => {
        if (!selectedCell) return;

        if (key.id === 'clear-btn') {
            selectedCell.innerText = '';
        } else {
            selectedCell.innerText = key.innerText;
        }

        checkErrors();
    });
});

const winScreen = document.getElementById('win-screen');
const restartBtn = document.getElementById('restart-btn');

function checkWin() {
    const allCells = document.querySelectorAll('.cell');
    
    let isAllFilled = true;
    let hasAnyError = false;

    allCells.forEach(cell => {
        if (cell.innerText === '') {
            isAllFilled = false;
        }
        if (cell.classList.contains('error')) {
            hasAnyError = true;
        }
    });

    if (isAllFilled && !hasAnyError) {
        winScreen.classList.remove('hidden');
    }
}

async function resetGame() {
    if (selectedCell) {
        selectedCell.classList.remove('selected');
        selectedCell = null;
    }

    winScreen.classList.add('hidden');
    
    await createBoard();
}

restartBtn.addEventListener('click', resetGame);

difficultySelect.addEventListener('change', () => {
    if (selectedCell) {
        selectedCell.classList.remove('selected');
        selectedCell = null;
    }
    createBoard();
});