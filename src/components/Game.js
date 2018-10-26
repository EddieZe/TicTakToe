/**
 ======== TicTakToe ==========
 * Author: Eddie Zeltser
 * Create Date: 25/10/2018
 */

import React, { Component } from 'react';
import Board from './Board'

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTurn: 'X',
            moves: 0
        };
        this.switchTurn = this.switchTurn.bind(this);
        this.onTurnTaken = this.onTurnTaken.bind(this);
    }

    switchTurn() {
        let newTurn = this.state.currentTurn === 'X' ? '0' : 'X';
        this.setState({currentTurn: newTurn, moves: this.state.moves + 1});
        return newTurn;
    }

    onTurnTaken(){
        return this.switchTurn();
    }

    render() {
        return (
            <div className="game">
                <div onClick={this.switchTurn}>{this.state.currentTurn}, It's your turn!</div>
                <Board onTurnTaken={this.onTurnTaken} firstTurn={this.state.currentTurn}/>
            </div>
        );
    }
}

export default Game;