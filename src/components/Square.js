/**
 ======== TicTakToe ==========
 * Author: Eddie Zeltser
 * Create Date: 26/10/2018
 */

import React, { Component } from 'react';

class Square extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps){
        return (!this.props.value && !!nextProps.value) || (!nextProps.value && !!this.props.value);
    }

    render() {
        return (
            <td
                className="square"
                onClick={this.props.handleFunc}>
                {this.props.value}
            </td>
        );
    }
}

export default Square