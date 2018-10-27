/**
 ======== TicTakToe ==========
 * Author: Eddie Zeltser
 * Create Date: 25/10/2018
 */

import React, { Component } from 'react';
import Square from './Square'

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTurn: 'X',
            moves: 0,
            boardSize: 3,
            board: [],
            isGameFinished: false,
            winner: null,
            winningSets: [
                [[0, 0], [0, 1], [0, 2]],
                [[1, 0], [1, 1], [1, 2]],
                [[2, 0], [2, 1], [2, 2]],
                [[0, 0], [1, 0], [2, 0]],
                [[0, 1], [1, 1], [2, 1]],
                [[0, 2], [1, 2], [2, 2]],
                [[0, 0], [1, 1], [2, 2]],
                [[0, 2], [1, 1], [2, 0]]
            ]
        };

        this.handleClick = this.handleClick.bind(this);
        this.switchTurn = this.switchTurn.bind(this);
        this.initGame = this.initGame.bind(this);
    }

    componentDidMount() {
        this.initGame();
    }

    initGame() {
        let board = this.state.board;
        for (var i = 0; i < this.state.boardSize; i++)
            board[i] = new Array(this.state.boardSize).fill(null);
        this.setState({
            currentTurn: 'X',
            moves: 0,
            boardSize: 3,
            isGameFinished: false,
            winner: null,
            board: board
        })
    }

    whoHasWon() {
        const sets = this.state.winningSets;
        let board = this.state.board;
        for (let i = 0; i < sets.length; i++) {
            const [a,b,c] = sets[i];
            if (board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]) {
                return board[a[0]][a[1]]
            }
        }
        return false;
    }

    handleClick(x, y) {
        let b = this.state.board;
        if (!b[x][y] && !this.state.isGameFinished) {
            b[x][y] = this.state.currentTurn;
            let winner = this.whoHasWon();
            this.switchTurn();
            if (winner) {
                console.log(winner + ' has Won');
                this.setState({isGameFinished: true, winner: winner})
            }
            else {
                this.setState({board: b});
            }
        }
    }

    renderSquare(x, y) {
        const val = this.state.board.length > 0 ? this.state.board[x][y] : null;
        return (
            <Square value={val} handleFunc={this.handleClick.bind(this,x,y)}
                    isGameFinished={this.state.isGameFinished}/>
        )
    }

    switchTurn() {
        let newTurn = this.state.currentTurn === 'X' ? '0' : 'X';
        let newMoves = 9 - this.state.moves > 0 ? this.state.moves + 1 : this.state.moves;
        this.setState({currentTurn: newTurn, moves: newMoves, isGameFinished: !(9 - newMoves > 0)});
        return newTurn;
    }

    render() {
        return (
            <div className="game">
                { !this.state.isGameFinished && !this.state.winner ?
                    <div className="gameIndicators">
                        <div>{this.state.currentTurn}, It's your turn!</div><div>{9 - this.state.moves} moves left</div></div> : null }
                <div className="board">
                    <table>
                        <tbody>
                        <tr>
                            {this.renderSquare(0, 0)}
                            {this.renderSquare(0, 1)}
                            {this.renderSquare(0, 2)}
                        </tr>
                        <tr>
                            {this.renderSquare(1, 0)}
                            {this.renderSquare(1, 1)}
                            {this.renderSquare(1, 2)}
                        </tr>
                        <tr>
                            {this.renderSquare(2, 0)}
                            {this.renderSquare(2, 1)}
                            {this.renderSquare(2, 2)}
                        </tr>
                        </tbody>
                    </table>
                </div>
                <button onClick={this.initGame.bind(this)}>Start over</button>
                <div className="gameFinished">
                    { this.state.isGameFinished && !this.state.winner ? <span>Game Over</span> : null }
                    { this.state.isGameFinished && this.state.winner ? <span>{this.state.winner} has won</span> : null }
                </div>
            </div>
        );
    }
}

export default Game;