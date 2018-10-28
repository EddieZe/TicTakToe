/**
 ======== TicTakToe ==========
 * Author: Eddie Zeltser
 * Create Date: 25/10/2018
 */

import React, {Component} from 'react';
import Square from './Square'
import {makeMove, resetGame, askToJoin} from '../connector';

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
        this.initGame();
        askToJoin((gameParams) => {
            if (gameParams) {
                this.updateState(gameParams);
            }
            else {
                console.log('Cannot Join, too many players already.')
            }
        })
    }

    initGame() {
        resetGame((gameParams) => {
            this.updateState(gameParams);
        });
        let board = this.state.board;
        for (let i = 0; i < this.state.boardSize; i++)
            board[i] = new Array(this.state.boardSize).fill(null);
        this.setState({
            board: board
        })
    }

    handleClick(x, y) {
        makeMove([x, y], this.state.playerSign, (gameParams) => {
            this.updateState(gameParams);
        });
        if (this.state.isGameFinished) {
            setTimeout(() => resetGame((gameParams) => {
                this.updateState(gameParams);
            }), 3000)
        }
    }

    updateState(newState) {
        this.setState({
            currentTurn: newState.currentTurn ? newState.currentTurn : this.state.currentTurn,
            playerSign: this.state.playerSign ? this.state.playerSign : newState.playerSign,
            moves: newState.moves,
            isGameFinished: newState.isGameFinished ? newState.isGameFinished : this.state.isGameFinished,
            winner: newState.winner ? newState.winner : this.state.winner,
            board: newState.board ? newState.board : this.state.board
        })
    }

    renderSquare(x, y) {
        return (
            <Square value={this.state.board[x][y]} handleFunc={() => this.handleClick(x, y)}
                    canBeChanged={!this.state.isGameFinished && this.state.currentTurn === this.state.playerSign}/>
        )
    }

    renderGameIndicators() {
        if (!this.state.isGameFinished && !this.state.winner) {
            if (this.state.playerSign) {
                return (
                    <div className="game-indicators">
                        <div>You playing as: {this.state.playerSign}</div>
                        <div> It's {this.state.currentTurn} turn!</div>
                        <div>{9 - this.state.moves} moves left</div>
                    </div>)
            }
            else {
                return (<div className="game-indicators">
                    {!this.state.playerSign &&
                    <div>This game is fully booked, You can only watch</div>}
                    <div>{9 - this.state.moves} moves left</div>
                </div>)
            }
        }
    }

    render() {
        return (
            <div className="game">
                {this.renderGameIndicators()}
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
                {this.state.playerSign && <button onClick={this.initGame.bind(this)}>Start over</button>}
                {this.state.isGameFinished &&
                <div className="game-finished">
                    {this.state.winner ? <span>{this.state.winner} has won</span> : <span>Game Over</span>}
                </div>
                }
            </div>
        );
    }
}

export default Game;