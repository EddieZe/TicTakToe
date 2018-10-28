/**
 ======== TicTakToe ==========
 * Author: Eddie Zeltser
 * Create Date: 25/10/2018
 */

import React, { Component } from 'react';
import Square from './Square'
import { makeMove, resetGame, askToJoin } from '../connector';

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTurn: '',
            playerSign: '',
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
        this.updateState = this.updateState.bind(this);
        this.initGame = this.initGame.bind(this);
    }

    componentWillMount() {
        askToJoin((gameParams) => {
            if (gameParams) {
                this.updateState(gameParams.data);
            }
            else {
                console.log('Cannot Join, too many players already.')
            }
        })
    }

    componentDidMount() {
        //this.initGame();
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
        makeMove([x,y], this.state.playerSign, (gameParams) => {
            this.updateState(gameParams.data);
        });
        let b = this.state.board;
        if (!b[x][y] && !this.state.isGameFinished) {
            b[x][y] = this.state.currentTurn;
            this.setState({board: b});
            //this.switchTurn();
        }
    }

    updateState(newState) {
        this.setState({
            currentTurn: newState.currentTurn ? newState.currentTurn : this.state.currentTurn,
            playerSign: newState.playerSign ? newState.playerSign : this.state.playerSign,
            moves: newState.moves ? newState.moves : this.state.moves,
            isGameFinished: newState.isGameFinished ? newState.isGameFinished : this.state.isGameFinished,
            winner: newState.winner ? newState.winner : this.state.winner,
            board: newState.board ? newState.board : this.state.board
        })
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
                        <div>{this.state.currentTurn}, It's your turn!</div>
                        <div>{9 - this.state.moves} moves left</div>
                    </div> : null }
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