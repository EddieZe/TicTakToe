/**
 ======== TicTakToe ==========
 * Author: Eddie Zeltser
 * Create Date: 27/10/2018
 */

const io = require('socket.io')();
const maxNumOfPlayers = 1, boardSize = 3;
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
let board = [];
let aiBoard = [[3, 2, 3], [2, 4, 2], [3, 2, 3]];
const players = [];
let gameStatus;

io.on('connection', (player) => {

    player.on('askToJoin', () => {
        if (players.length < maxNumOfPlayers) {
            let sign = players.length === 0 ? 'X' : players[0].sign === 'X' ? 'O' : "X";
            let newPlayer = {id: player.id, sign: sign};
            players.push(newPlayer);
            if (!gameStatus) {
                initGame()
            }
            gameStatus.playerSign = newPlayer.sign;
            player.emit('joinedToGame', gameStatus);
        }
        else {
            player.emit('gameIsFull');
        }
    });

    player.on('resetGame', () => {
        initGame();
        io.sockets.emit('updateStatus', gameStatus);
    });

    player.on('makeMove', (cords, sign) => {
        console.log(sign + ' asked to make the following move: ' + cords[0] + ',' + cords[1]);
        gameStatus.board[cords[0]][cords[1]] = sign;
        //gameStatus.currentTurn = gameStatus.currentTurn === 'X' ? 'O' : 'X';
        gameStatus.moves = 9 - gameStatus.moves > 0 ? gameStatus.moves + 2 : gameStatus.moves;

        let nextMachineMove = blockNextWin();
        if (nextMachineMove) {
            aiBoard[nextMachineMove[0]][nextMachineMove[1]] = 0;
            gameStatus.board[nextMachineMove[0]][nextMachineMove[1]] = 'O';
        }
        else {
            nextMachineMove = updateAndFindBestOption(cords);
            gameStatus.board[nextMachineMove.x][nextMachineMove.y] = 'O';
        }
        let winner = checkIsGameFinished();
        if (winner || gameStatus.moves === 9) {
            gameStatus.winner = winner;
            gameStatus.isGameFinished = true;
        }
        io.sockets.emit('updateStatus', gameStatus);
    });

    player.on('disconnect', () => {
        let index = players.map(function (e) {
            return e.id;
        }).indexOf(player.id);
        if (index > -1) {
            players.splice(index, 1);
        }
    })
});

function updateAndFindBestOption(cords) {
    aiBoard[cords[0]][cords[1]] = 0;
    let max = 0, bestCell = {};
    aiBoard.forEach((row, indexX) => {
        row.forEach((el, indexY) => {
            if (el > max) {
                max = el;
                bestCell.x = indexX;
                bestCell.y = indexY;
            }
        })
    });
    aiBoard[bestCell.x][bestCell.y] = 0;
    return bestCell
}

function blockNextWin() {
    let res = null;
    winningSets.forEach(set => {
        let board = gameStatus.board;
        let cellA = set[0], cellB = set[1], cellC = set[2];
        if (board[cellA[0]][cellA[1]] === 'X' && board[cellA[0]][cellA[1]] === board[cellB[0]][cellB[1]] && !board[cellC[0]][cellC[1]]) {
            res = cellC
        }
        else if (board[cellA[0]][cellA[1]] === 'X' && board[cellA[0]][cellA[1]] === board[cellC[0]][cellC[1]] && !board[cellB[0]][cellB[1]]) {
            res = cellB
        }
        else if (board[cellB[0]][cellB[1]] === 'X' && board[cellB[0]][cellB[1]] === 'X' === board[cellC[0]][cellC[1]] && !board[cellA[0]][cellA[1]]) {
            res = cellA
        }
    });
    return res;
}

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
    for (let i = 0; i < boardSize; i++) {
        board[i] = new Array(boardSize).fill(null);
    }
    aiBoard = [[3, 2, 3], [2, 4, 2], [3, 2, 3]];
    gameStatus = {
        board: board,
        currentTurn: 'X',
        moves: 0,
        winner: null,
        isGameFinished: false
    }
}

const port = 8000;
io.listen(port);
console.log('listening on port ', port);