# Connect 4 Game

A simple browser-based Connect 4 game built with pure HTML, CSS, and JavaScript. Two players can play on the same computer, taking turns to drop their pieces.

## Features

- Clean, modern UI
- Two-player gameplay on the same browser
- Turn-based system with clear player indicators
- Win detection (horizontal, vertical, and diagonal)
- Draw detection
- Reset game functionality
- No external dependencies required

## How to Play

1. Open `index.html` in your web browser
2. Click "Start New Game"
3. Players take turns clicking on columns to drop their pieces:
   - Player 1: Red pieces
   - Player 2: Yellow pieces
4. Win by connecting 4 pieces in a row (horizontally, vertically, or diagonally)
5. Use the "Reset Game" button to start a new game at any time

## Files

- `index.html`: Game interface and structure
- `styles.css`: Game styling and animations
- `game.js`: Game logic and mechanics

## Implementation Details

The game is implemented entirely in frontend JavaScript with no external dependencies. Key features include:
- Board state management
- Turn switching
- Win condition checking in all directions
- Draw condition detection
- Dynamic UI updates
