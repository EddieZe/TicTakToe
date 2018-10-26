/**
 ======== TicTakToe ==========
 * Author: Eddie Zeltser
 * Create Date: 26/10/2018
 */

import React, { Component } from 'react';

class Square extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            handleFunc: props.handleFunc
        };
    }

    shouldComponentUpdate(nextProps){
        return (!this.state.value && !!nextProps.value) || (!nextProps.value && !!this.state.value);
    }

    componentWillUpdate(nextProps){
        /*Not a good practice solution. need to find better one!*/
        this.setState({value: nextProps.value, handleFunc: nextProps.handleFunc});
    }

    render() {
        return (
            <td
                className="square"
                onClick={this.state.handleFunc}>
                {this.state.value}
            </td>
        );
    }
}

export default Square