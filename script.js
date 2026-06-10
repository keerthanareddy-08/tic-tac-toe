// Game state
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let playerWins = 0;
let computerWins = 0;

// Winning combinations
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// DOM elements
const gameBoardEl = document.getElementById('gameBoard');
const gameStatusEl = document.getElementById('gameStatus');
const playerWinsEl = document.getElementById('playerWins');
const computerWinsEl = document.getElementById('computerWins');
const newGameBtn = document.getElementById('newGameBtn');
const resetScoreBtn = document.getElementById('resetScoreBtn');
const cells = document.querySelectorAll('.cell');

// Initialize game
function initializeGame() {
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    newGameBtn.addEventListener('click', resetGame);
    resetScoreBtn.addEventListener('click', resetScore);
}

// Handle cell click
function handleCellClick(e) {
    const cell = e.target;
    const index = cell.getAttribute('data-index');

    // Check if cell is empty and game is active
    if (gameBoard[index] !== '' || !gameActive) {
        return;
    }

    // Player move
    gameBoard[index] = 'X';
    updateCell(cell, 'X');

    // Check if player won
    if (checkWinner('X')) {
        endGame('You Win! 🎉');
        playerWins++;
        playerWinsEl.textContent = playerWins;
        highlightWinningCells('X');
        return;
    }

    // Check for draw
    if (isBoardFull()) {
        endGame("It's a Draw! 🤝");
        return;
    }

    // Update game status
    gameStatusEl.textContent = "Computer's Turn (O)";
    gameActive = false;

    // Computer move after a delay
    setTimeout(makeComputerMove, 500);
}

// Make computer move
function makeComputerMove() {
    // Find available moves
    const availableMoves = gameBoard
        .map((cell, index) => (cell === '' ? index : null))
        .filter(val => val !== null);

    if (availableMoves.length === 0) {
        return;
    }

    // Get best move using minimax
    let bestMove = getBestMove();

    // Make the move
    gameBoard[bestMove] = 'O';
    const cell = document.querySelector(`[data-index="${bestMove}"]`);
    updateCell(cell, 'O');

    // Check if computer won
    if (checkWinner('O')) {
        endGame('Computer Wins! 🤖');
        computerWins++;
        computerWinsEl.textContent = computerWins;
        highlightWinningCells('O');
        return;
    }

    // Check for draw
    if (isBoardFull()) {
        endGame("It's a Draw! 🤝");
        return;
    }

    // Update game status and allow player move
    gameStatusEl.textContent = "Your Turn (X)";
    gameActive = true;
}

// Minimax algorithm for optimal computer moves
function minimax(board, depth, isMaximizing) {
    const score = evaluateBoard(board);

    if (score === 10) return 10 - depth; // Computer wins
    if (score === -10) return -10 + depth; // Player wins
    if (isBoardFullUtil(board)) return 0; // Draw

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                const score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(bestScore, score);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                const score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(bestScore, score);
            }
        }
        return bestScore;
    }
}

// Get best move for computer
function getBestMove() {
    let bestScore = -Infinity;
    let bestMove = 0;

    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            const score = minimax(gameBoard, 0, false);
            gameBoard[i] = '';

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove;
}

// Evaluate board state
function evaluateBoard(board) {
    // Check if computer (O) won
    if (checkWinnerUtil(board, 'O')) return 10;
    // Check if player (X) won
    if (checkWinnerUtil(board, 'X')) return -10;
    // Draw
    return 0;
}

// Check winner utility function
function checkWinnerUtil(board, player) {
    for (let combination of winningCombinations) {
        if (combination.every(index => board[index] === player)) {
            return true;
        }
    }
    return false;
}

// Check if board is full utility
function isBoardFullUtil(board) {
    return board.every(cell => cell !== '');
}

// Check if current player won
function checkWinner(player) {
    return winningCombinations.some(combination =>
        combination.every(index => gameBoard[index] === player)
    );
}

// Get winning cells
function getWinningCells(player) {
    for (let combination of winningCombinations) {
        if (combination.every(index => gameBoard[index] === player)) {
            return combination;
        }
    }
    return [];
}

// Highlight winning cells
function highlightWinningCells(player) {
    const winningCells = getWinningCells(player);
    winningCells.forEach(index => {
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.classList.add('winner');
    });
}

// Check if board is full
function isBoardFull() {
    return gameBoard.every(cell => cell !== '');
}

// Update cell display
function updateCell(cell, player) {
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
    cell.classList.add('disabled');
}

// End game
function endGame(message) {
    gameActive = false;
    gameStatusEl.textContent = message;
    gameStatusEl.classList.add(message.includes('Draw') ? 'draw' : 'winner');
}

// Reset game
function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    gameStatusEl.textContent = "Your Turn (X)";
    gameStatusEl.classList.remove('winner', 'draw');
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'disabled', 'winner');
    });
}

// Reset score
function resetScore() {
    playerWins = 0;
    computerWins = 0;
    playerWinsEl.textContent = playerWins;
    computerWinsEl.textContent = computerWins;
    resetGame();
}

// Initialize the game
initializeGame();