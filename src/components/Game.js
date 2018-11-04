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
            winner: null
        };

        this.handleClick = this.handleClick.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    componentWillMount() {
        askToJoin((gameParams) => {
            if (gameParams) {
                this.updateState(gameParams);
            }
        });
    }

    resetGame() {
        resetGame();
    }

    handleClick(x, y) {
        makeMove([x, y], this.state.playerSign);
    }

    updateState(newState) {
        this.setState({
            currentTurn: newState.currentTurn,
            playerSign: this.state.playerSign ? this.state.playerSign : newState.playerSign,
            moves: newState.moves,
            isGameFinished: newState.isGameFinished,
            winner: newState.winner,
            board: newState.board,
            isDataLoaded : true
        });
        if (this.state.isGameFinished) {
            setTimeout(() => resetGame(), 3000)
        }
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
                    <div>This game is fully booked, Please try again later</div>}
                </div>)
            }
        }
    }

    render() {
        return (
            <div className="game">
                {this.renderGameIndicators()}
                {this.state.isDataLoaded &&
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
                }
                {this.state.playerSign && <button onClick={this.resetGame.bind(this)}>Cleanup</button>}
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