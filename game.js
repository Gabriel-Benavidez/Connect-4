class Connect4 {
    constructor() {
        this.socket = new WebSocket('ws://localhost:8765');
        this.gameId = null;
        this.playerNumber = null;
        this.currentPlayer = 1;
        this.board = Array(6).fill().map(() => Array(7).fill(0));
        
        this.setupEventListeners();
        this.setupWebSocket();
    }
    
    setupEventListeners() {
        document.getElementById('create-game').addEventListener('click', () => this.createGame());
        document.getElementById('join-button').addEventListener('click', () => this.joinGame());
        
        // Create the game board UI
        const boardElement = document.getElementById('board');
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
    
    setupWebSocket() {
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            switch(data.type) {
                case 'game_created':
                    this.gameId = data.game_id;
                    this.playerNumber = data.player;
                    document.getElementById('game-info').textContent = `You are Player ${this.playerNumber}. Game ID: ${this.gameId}`;
                    document.getElementById('game-controls').style.display = 'none';
                    break;
                    
                case 'game_joined':
                    this.playerNumber = data.player;
                    document.getElementById('game-info').textContent = `You are Player ${this.playerNumber}`;
                    document.getElementById('game-controls').style.display = 'none';
                    break;
                    
                case 'game_start':
                    document.getElementById('game-info').textContent += ' - Game Started!';
                    break;
                    
                case 'update':
                    this.updateBoard(data.board);
                    this.currentPlayer = data.current_player;
                    
                    if (data.winner) {
                        document.getElementById('game-info').textContent = `Player ${data.winner} wins!`;
                    } else {
                        document.getElementById('game-info').textContent = 
                            `You are Player ${this.playerNumber} - ${this.currentPlayer === this.playerNumber ? 'Your turn' : 'Opponent\'s turn'}`;
                    }
                    break;
            }
        };
    }
    
    createGame() {
        this.socket.send(JSON.stringify({
            type: 'create'
        }));
        document.getElementById('join-game').style.display = 'block';
    }
    
    joinGame() {
        const gameId = document.getElementById('game-id').value;
        this.gameId = gameId;
        this.socket.send(JSON.stringify({
            type: 'join',
            game_id: gameId
        }));
    }
    
    handleMove(column) {
        if (this.currentPlayer === this.playerNumber) {
            this.socket.send(JSON.stringify({
                type: 'move',
                game_id: this.gameId,
                column: column
            }));
        }
    }
    
    updateBoard(newBoard) {
        this.board = newBoard;
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 7; col++) {
                const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                cell.className = 'cell';
                if (newBoard[row][col] === 1) {
                    cell.classList.add('player1');
                } else if (newBoard[row][col] === 2) {
                    cell.classList.add('player2');
                }
            }
        }
    }
}

// Start the game when the page loads
window.onload = () => {
    new Connect4();
};
