/**
 ======== TicTakToe ==========
 * Author: Eddie Zeltser
 * Create Date: 25/10/2018
 */

import React, { Component } from 'react';
import Square from './Square'

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            boardSize: 3,
            board: [],
            onTurnTaken: props.onTurnTaken,
            nextTurn: props.firstTurn,
            winningSets : [
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
        let board = this.state.board;
        for (var i = 0; i < this.state.boardSize; i++)
            board[i] = new Array(this.state.boardSize).fill(null);
        this.state.board = board;

        this.handleClick = this.handleClick.bind(this);
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
        b[x][y] = this.state.nextTurn;
        let winner = this.whoHasWon();
        if (winner) {
            console.log(winner + ' has Won')
        }
        this.setState({board: b, nextTurn: this.state.onTurnTaken()});
    }

    renderSquare(x, y) {
        return (
            <Square value={this.state.board[x][y]} handleFunc={this.handleClick.bind(this,x,y)}/>
        )
    }

    render() {
        return (
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
        );
    }
}

export default Board;