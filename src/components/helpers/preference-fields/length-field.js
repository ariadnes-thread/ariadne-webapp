/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {PreferenceSchema} from '../../../util/preferences-state';
import PreferenceField from './preference-field';

export default class LengthField extends Component {

    static propTypes = {
        currentPrefState: PropTypes.any.isRequired,
        updatePreference: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.fieldData = PreferenceSchema.length;
        this.fieldName = this.fieldData.name;
        this.prefState = this.props.currentPrefState;

        let initialValue = this.props.currentPrefState.get(this.fieldName);
        if (!initialValue) initialValue = PreferenceSchema.length.defaultValue;
        this.state = {
            length: initialValue,
        };

        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    toggle(enabled) {
        if (enabled) this.prefState.enable(this.fieldName);
        else this.prefState.disable(this.fieldName);
    }

    handleChange(event) {
        // Note the `+`: it converts string to int.
        const value = +event.target.value;
        this.props.updatePreference(this.fieldName, value);
        this.setState({length: value});
    }

    render() {
        return (
            <PreferenceField fieldData={this.fieldData} toggle={this.toggle} enabled={this.prefState.isEnabled(this.fieldName)}>
                <input className="slider has-output" step={this.fieldData.step} min={this.fieldData.min}
                       max={this.fieldData.max} value={this.state.length} onChange={this.handleChange}
                       id="routeLengthSlider" type="range"/>
                <span style={{display: 'inline-block', width: '4.1rem'}}>{this.state.length} m</span>
            </PreferenceField>
        );
    }
}
