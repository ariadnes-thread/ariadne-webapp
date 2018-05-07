/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import Icon from '@fortawesome/react-fontawesome';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class PreferenceField extends Component {

    static propTypes = {
        fieldData: PropTypes.object.isRequired,
        toggle: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.fieldData = this.props.fieldData;
        this.label = `${this.fieldData.name}Cb`;
        this.state = {
            enabled: this.fieldData.enabledByDefault,
        };

        this.toggleEnable = this.toggleEnable.bind(this);
    }

    toggleEnable(event) {
        this.props.toggle(event.target.checked);
        this.setState({
            enabled: event.target.checked,
        });
    }

    render() {
        let wrapperStyle = {};
        if (!this.state.enabled) {
            wrapperStyle.opacity = 0.5;
        }
        return (
            <div style={wrapperStyle}>
                <div className="columns is-vcentered">
                    <div className="column is-narrow">
                        <div className="field">
                            <input className="is-checkradio is-medium" onChange={this.toggleEnable}
                                   type="checkbox" id={this.label} checked={this.state.enabled}/>
                            <label htmlFor={this.label}>{this.fieldData.displayName}</label>
                            {this.fieldData.description &&
                            <span className="ariadne-preference-info tooltip is-tooltip-right is-tooltip-multiline"
                                  data-tooltip={this.fieldData.description}>
                                <Icon icon="question-circle"/>
                            </span>}
                        </div>
                    </div>
                    <div className="column has-text-right">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }

}
