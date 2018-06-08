/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {PreferenceSchema, TransportType} from '../../../util/preferences-state';
import PreferenceField from './preference-field';
import IconButton from '../icon-button';

export default class TransportTypeField extends Component {

    static propTypes = {
        currentPrefState: PropTypes.any.isRequired,
        updatePreference: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.fieldData = PreferenceSchema.transportType;
        this.fieldName = this.fieldData.name;
        this.prefState = this.props.currentPrefState;

        const initialValue = this.prefState.get(this.fieldName);
        this.state = {
            transportType: initialValue,
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle(enabled) {
        if (enabled) this.prefState.enable(this.fieldName);
        else this.prefState.disable(this.fieldName);
    }

    setOption(value) {
        this.props.updatePreference(this.fieldName, value);
        this.setState({
            transportType: value,
        });
    }

    renderOptions() {
        this.options = [
            {name: 'Walk', icon: 'male', value: TransportType.Walk},
            {name: 'Run', icon: 'child', value: TransportType.Run},
            {name: 'Cycle', icon: 'bicycle', value: TransportType.Bike},
        ];

        const components = new Array(this.options.length);
        for (let i = 0; i < this.options.length; i++) {
            const option = this.options[i];
            let type = null;
            if (option.value === this.state.transportType) type = 'info';

            components[i] = <IconButton key={i}
                                        icon={option.icon}
                                        type={type}
                                        onClick={() => this.setOption(option.value)}>{option.name}</IconButton>;
        }
        return components;
    }

    render() {
        return (
            <PreferenceField fieldData={this.fieldData} toggle={this.toggle} enabled={this.prefState.isEnabled(this.fieldName)}>
                <div className="buttons has-addons is-right">
                    {this.renderOptions()}
                </div>
            </PreferenceField>
        );
    }
}
