/**
 ======== TicTakToe ==========
 * Author: Eddie Zeltser
 * Create Date: 27/10/2018
 */

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

function makeMove(cords, sign, cb) {
    socket.on('updateStatus', (gameParams) => {
        cb(gameParams);
    });
    socket.emit('makeMove', cords, sign);
}

function resetGame(cb) {
    socket.on('updateStatus', (gameParams) => {
        cb(gameParams);
    });
    socket.emit('resetGame');
}

function askToJoin(cb) {
    socket.on('joinedToGame', (gameParams) => {
        cb(gameParams);
    });
    socket.on('gameIsFull', () => {
        cb()
    });
    socket.emit('askToJoin', 'Eddie')
}

socket.on('gameFinished', () => {

});
export { makeMove, resetGame, askToJoin }