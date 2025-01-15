import asyncio
import json
import websockets

# Game state
games = {}

class Connect4:
    def __init__(self):
        self.board = [[0 for _ in range(7)] for _ in range(6)]
        self.current_player = 1
        self.winner = None
        self.players = []
        
    def make_move(self, column):
        if self.winner or column < 0 or column > 6:
            return False
            
        # Find the first empty row in the column
        for row in range(5, -1, -1):
            if self.board[row][column] == 0:
                self.board[row][column] = self.current_player
                if self.check_win(row, column):
                    self.winner = self.current_player
                self.current_player = 3 - self.current_player  # Switch between 1 and 2
                return True
        return False
        
    def check_win(self, row, col):
        # Check horizontal
        for c in range(max(0, col-3), min(4, col+1)):
            if all(self.board[row][c+i] == self.current_player for i in range(4)):
                return True
                
        # Check vertical
        if row <= 2:
            if all(self.board[row+i][col] == self.current_player for i in range(4)):
                return True
                
        # Check diagonal (top-left to bottom-right)
        for r in range(max(0, row-3), min(3, row+1)):
            c = col - (row - r)
            if 0 <= c <= 3:
                if all(self.board[r+i][c+i] == self.current_player for i in range(4)):
                    return True
                    
        # Check diagonal (top-right to bottom-left)
        for r in range(max(0, row-3), min(3, row+1)):
            c = col + (row - r)
            if 3 <= c <= 6:
                if all(self.board[r+i][c-i] == self.current_player for i in range(4)):
                    return True
        
        return False

async def handle_connection(websocket):
    # Wait for the initial connection message
    try:
        async for message in websocket:
            data = json.loads(message)
            game_id = data.get('game_id')
            
            if data['type'] == 'create':
                # Create new game
                game_id = str(len(games))
                games[game_id] = Connect4()
                games[game_id].players.append(websocket)
                await websocket.send(json.dumps({
                    'type': 'game_created',
                    'game_id': game_id,
                    'player': 1
                }))
                
            elif data['type'] == 'join':
                # Join existing game
                if game_id in games and len(games[game_id].players) < 2:
                    games[game_id].players.append(websocket)
                    await websocket.send(json.dumps({
                        'type': 'game_joined',
                        'game_id': game_id,
                        'player': 2
                    }))
                    # Notify both players that game can start
                    for player in games[game_id].players:
                        await player.send(json.dumps({
                            'type': 'game_start',
                            'board': games[game_id].board
                        }))
                        
            elif data['type'] == 'move':
                game = games.get(game_id)
                if game and websocket in game.players:
                    player_num = game.players.index(websocket) + 1
                    if player_num == game.current_player:
                        if game.make_move(data['column']):
                            # Send updated game state to both players
                            update = {
                                'type': 'update',
                                'board': game.board,
                                'current_player': game.current_player,
                                'winner': game.winner
                            }
                            for player in game.players:
                                await player.send(json.dumps(update))
                                
    except websockets.exceptions.ConnectionClosed:
        # Remove player from game
        for game_id, game in games.items():
            if websocket in game.players:
                game.players.remove(websocket)
                if len(game.players) == 0:
                    del games[game_id]
                break

async def main():
    async with websockets.serve(handle_connection, "localhost", 8765):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
