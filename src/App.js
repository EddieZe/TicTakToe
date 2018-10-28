/**
 ======== TicTakToe ==========
 * Author: Eddie Zeltser
 * Create Date: 25/10/2018
 */

import React, { Component } from 'react';
import './style.css';
import Game from './components/Game'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }

    render() {
        return (
            <div className="app">
                <header className="app-header">
                    <h1 className="app-title">TicTakToe Game</h1>
                </header>
                <Game/>
            </div>
        );
    }
}

export default App;