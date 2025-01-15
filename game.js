class Connect4 {
    constructor() {
        this.currentPlayer = 1;
        this.board = Array(6).fill().map(() => Array(7).fill(0));
        this.gameActive = false;
        this.setupBoard();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.getElementById('start-game').addEventListener('click', () => this.startGame());
        document.getElementById('reset-game').addEventListener('click', () => this.resetGame());
    }
    
    setupBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = ''; // Clear existing board
        
        for (let col = 0; col < 7; col++) {
            const column = document.createElement('div');
            column.className = 'column';
            column.dataset.column = col;
            
            for (let row = 0; row < 6; row++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                column.appendChild(cell);
            }
            
            column.addEventListener('click', (e) => this.handleMove(col));
            boardElement.appendChild(column);
        }
    }
    
    startGame() {
        this.gameActive = true;
        this.currentPlayer = 1;
        this.board = Array(6).fill().map(() => Array(7).fill(0));
        this.setupBoard();
        document.getElementById('game-info').textContent = "Player 1's Turn";
        document.getElementById('reset-game').style.display = 'block';
        document.getElementById('start-game').style.display = 'none';
    }
    
    resetGame() {
        this.startGame();
    }
    
    handleMove(column) {
        if (!this.gameActive) return;
        
        // Find the first empty row in the column
        for (let row = 5; row >= 0; row--) {
            if (this.board[row][column] === 0) {
                this.board[row][column] = this.currentPlayer;
                this.updateCell(row, column);
                
                if (this.checkWin(row, column)) {
                    document.getElementById('game-info').textContent = `Player ${this.currentPlayer} Wins!`;
                    this.gameActive = false;
                    document.getElementById('start-game').style.display = 'block';
                    return;
                }
                
                if (this.checkDraw()) {
                    document.getElementById('game-info').textContent = "It's a Draw!";
                    this.gameActive = false;
                    document.getElementById('start-game').style.display = 'block';
                    return;
                }
                
                this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
                document.getElementById('game-info').textContent = `Player ${this.currentPlayer}'s Turn`;
                return;
            }
        }
    }
    
    updateCell(row, column) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${column}"]`);
        cell.className = 'cell';
        cell.classList.add(`player${this.currentPlayer}`);
    }
    
    checkWin(row, col) {
        const directions = [
            [[0,1], [0,-1]], // horizontal
            [[1,0], [-1,0]], // vertical
            [[1,1], [-1,-1]], // diagonal /
            [[1,-1], [-1,1]] // diagonal \
        ];
        
        for (let [dir1, dir2] of directions) {
            let count = 1;
            
            // Check first direction
            let r = row + dir1[0];
            let c = col + dir1[1];
            while (r >= 0 && r < 6 && c >= 0 && c < 7 && this.board[r][c] === this.currentPlayer) {
                count++;
                r += dir1[0];
                c += dir1[1];
            }
            
            // Check opposite direction
            r = row + dir2[0];
            c = col + dir2[1];
            while (r >= 0 && r < 6 && c >= 0 && c < 7 && this.board[r][c] === this.currentPlayer) {
                count++;
                r += dir2[0];
                c += dir2[1];
            }
            
            if (count >= 4) return true;
        }
        return false;
    }
    
    checkDraw() {
        return this.board[0].every(cell => cell !== 0);
    }
}

// Start the game when the page loads
window.onload = () => {
    new Connect4();
};
