/**
 ======== TicTakToe ==========
 * Author: Eddie Zeltser
 * Create Date: 27/10/2018
 */

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

function resetGame() {
    socket.emit('resetGame');
}

function makeMove(cords, sign) {
    socket.emit('makeMove', cords, sign);
}

function askToJoin(cb) {
    socket.on('joinedToGame', (gameParams) => {
        cb(gameParams);
    });
    socket.on('gameIsFull', () => {
        cb()
    });
    socket.on('updateStatus', (gameParams) => {
        cb(gameParams);
    });
    socket.emit('askToJoin')
}

export { makeMove, resetGame, askToJoin }