/**
 ======== TicTakToe ==========
 * Author: Eddie Zeltser
 * Create Date: 26/10/2018
 */

import React, { Component } from 'react';

class Square extends Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    shouldComponentUpdate(nextProps){
        return (!this.props.value && !!nextProps.value) || (!nextProps.value && !!this.props.value);
    }

    onClick(cb){
        if (this.props.canBeChanged){
            cb();
        }
    }

    render() {
        return (
            <td
                className="square"
                onClick={() => this.onClick(this.props.handleFunc)}>
                {this.props.value}
            </td>
        );
    }
}

export default Square