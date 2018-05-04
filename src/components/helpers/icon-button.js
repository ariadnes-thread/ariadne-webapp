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
        active: propTypes.bool,
    };

    render() {
        const sizeClass = this.props.size ? `is-${this.props.size}` : '';
        const typeClass = this.props.type ? `is-${this.props.type}` : '';
        const activeClass = this.props.active ? 'is-selected' : '';

        const buttonClass = `button ${sizeClass} ${typeClass} ${activeClass}`;
        const iconClass = `icon ${sizeClass}`;

        return (
            <span className={buttonClass}>
                <Icon className={iconClass} icon={this.props.icon}/>
                <span>{this.props.children}</span>
            </span>
        );
    }

}
