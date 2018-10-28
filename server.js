/**
 ======== TicTakToe ==========
 * Author: Eddie Zeltser
 * Create Date: 27/10/2018
 */

const io = require('socket.io')();
const maxNumOfPlayers = 2, boardSize = 3;
const winningSets = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
];
const players = [];
let gameStatus;

io.on('connection', (player) => {

    player.on('askToJoin', (name) => {
        if (players.length < maxNumOfPlayers) {
            let sign = players.length === 0 ? 'X' : players[0].sign === 'X' ? 'O' : "X";

            let newPlayer = {id: player.id, name: name, sign: sign};
            players.push(newPlayer);

            if (!gameStatus) {
                initGame()
            }

            gameStatus.playerSign = newPlayer.sign;
            console.log('Player: ' + newPlayer.name + ' joined to the game, with the sign: ' + newPlayer.sign);
            player.emit('joinedToGame', gameStatus);
            if (players.length === maxNumOfPlayers) {
                io.sockets.emit('canStartTheGame');
            }
        }
        else {
            player.emit('gameIsFull');
        }
    });

    player.on('resetGame', () => {
        initGame();
        io.sockets.emit('updateStatus', gameStatus);
        console.log('Game Restarted')
    });

    player.on('makeMove', (cords, sign) => {
        console.log(sign + ' asked to make the following move: ' + cords[0] + ',' + cords[1]);
        gameStatus.board[cords[0]][cords[1]] = sign;
        gameStatus.currentTurn = gameStatus.currentTurn === 'X' ? 'O' : 'X';
        gameStatus.moves = 9 - gameStatus.moves > 0 ? gameStatus.moves + 1 : gameStatus.moves;
        let winner = checkIsGameFinished();
        if (winner || gameStatus.moves === 0) {
            gameStatus.winner = winner;
            gameStatus.isGameFinished = true;
        }
        io.sockets.emit('updateStatus', gameStatus)
    });

    player.on('disconnect', () => {
        let index = players.map(function(e) { return e.id; }).indexOf(player.id);
        if (index > -1) {
            players.splice(index, 1);
        }
    })
});

function checkIsGameFinished() {
    const sets = winningSets;
    let board = gameStatus.board;
    for (let i = 0; i < sets.length; i++) {
        const [a, b, c] = sets[i];
        if (board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]) {
            return board[a[0]][a[1]]
        }
    }
    return false;
}

function initGame() {
    let board = [];
    for (var i = 0; i < boardSize; i++) {
        board[i] = new Array(boardSize).fill(null);
    }
    gameStatus = {
        board: board,
        currentTurn: 'X',
        moves: 0
    }
}

const port = 8000;
io.listen(port);
console.log('listening on port ', port);