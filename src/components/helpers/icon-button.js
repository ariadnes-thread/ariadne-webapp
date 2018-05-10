/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import Icon from '@fortawesome/react-fontawesome';
import React, {Component} from 'react';
import propTypes from 'prop-types';

export default class IconButton extends Component {

    static propTypes = {
        icon: propTypes.string.isRequired,
        size: propTypes.string,
        type: propTypes.string,
        trailingIcon: propTypes.string,
        active: propTypes.bool,
    };

    render() {
        const sizeClass = this.props.size ? `is-${this.props.size}` : '';
        const typeClass = this.props.type ? `is-${this.props.type}` : '';
        const activeClass = this.props.active ? 'is-selected' : '';

        const buttonClass = `button ${sizeClass} ${typeClass} ${activeClass}`;

        return (
            <span className={buttonClass} onClick={this.props.onClick}>
                <span className="icon"><Icon icon={this.props.icon}/></span>
                <span>{this.props.children}</span>
                {this.props.trailingIcon && <span className="icon"><Icon icon={this.props.trailingIcon}/></span>}
            </span>
        );
    }

}
