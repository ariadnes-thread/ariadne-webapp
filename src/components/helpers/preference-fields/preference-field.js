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
        toggleable: PropTypes.bool,
        enabled: PropTypes.bool,
    };

    static defaultProps = {
        toggleable: true,
        enabled: true,
    };

    constructor(props) {
        super(props);

        this.fieldData = this.props.fieldData;
        this.label = `${this.fieldData.name}Cb`;
        this.state = {
            enabled: this.props.enabled,
        };

        this.toggleEnable = this.toggleEnable.bind(this);
    }

    toggleEnable(event) {
        if (!this.props.toggleable) return;

        this.props.toggle(event.target.checked);
        this.setState({
            enabled: event.target.checked,
        });
    }

    render() {
        let wrapperStyle = {
            marginBottom: '1rem',
        };
        if (!this.state.enabled) {
            wrapperStyle.opacity = 0.5;
        }

        return (
            <div style={wrapperStyle}>
                <div className="columns is-vcentered">
                    <div className="column is-narrow">
                        <div className="field">
                            {this.props.toggleable &&
                            <span>
                                <input className="is-checkradio" onChange={this.toggleEnable}
                                       type="checkbox" id={this.label} checked={this.state.enabled}/>
                                <label htmlFor={this.label}>{this.fieldData.displayName}</label>
                            </span>
                            }
                            {!this.props.toggleable &&
                            <div style={{marginLeft: '10px'}}>{this.fieldData.displayName}</div>
                            }
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
