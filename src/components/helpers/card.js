/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';

export default class Card extends Component {
    render() {
        return (
            <div className="card">
                <div className="card-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
