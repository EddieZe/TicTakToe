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

    player.on('askToJoin', (name) =>{
        if (players.length < maxNumOfPlayers) {
            let newPlayer = {name: name, sign: players.length === 0 ? 'X' : 'O'};
            players.push(newPlayer);
            if (!gameStatus){initGame()}
            let data = {
                board : gameStatus.board,
                playerSign: newPlayer.sign,
                currentTurn: 'X',
                moves: 0
            };
            player.emit('joinedToGame', {data: data});
            console.log('Player: ' + newPlayer.name + ' joined to the game, with the sign: ' + newPlayer.sign);
            if (players.length === maxNumOfPlayers) {
                player.emit('canStartTheGame');
            }
        }
        else {
            player.emit('gameIsFull');
        }
    });

    player.on('resetGame', () => {
        initGame();
        updatePlayersWithStatus();
    });

    player.on('makeMove', (cords, sign) => {
        console.log(sign + ' asked to make the following move: ' + cords[0] + ',' + cords[1]);
        gameStatus.board[cords[0]][cords[1]] = sign;
        gameStatus.currentTurn = gameStatus.currentTurn === 'X' ? '0' : 'X';
        gameStatus.moves = 9 - gameStatus.moves > 0 ? gameStatus.moves + 1 : gameStatus.moves;
        let winner = checkIsGameFinished();
        if (winner){
            gameStatus.winner = winner;
            gameStatus.isGameFinished = true;
        }
        player.emit('updateStatus', gameStatus)
    });

    player.on('disconnect', () => {
        //remove from players list
        if (players.length === 0) {
            initGame();
        }
    })
});

function checkIsGameFinished() {
    const sets = winningSets;
    let board = gameStatus.board;
    for (let i = 0; i < sets.length; i++) {
        const [a,b,c] = sets[i];
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