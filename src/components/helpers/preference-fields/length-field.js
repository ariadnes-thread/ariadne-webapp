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
        updatePreference: PropTypes.func.isRequired,
        initialValue: PropTypes.any.isRequired,
    };

    constructor(props) {
        super(props);

        this.fieldData = PreferenceSchema.length;
        this.fieldName = this.fieldData.name;

        const initialValue = this.props.initialValue ? this.props.initialValue : PreferenceSchema.length.defaultValue;
        this.state = {
            length: initialValue,
        };

        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    toggle(enabled) {
        if (enabled) this.props.updatePreference(this.fieldName, this.state.length);
        else this.props.updatePreference(this.fieldName, null);
    }

    handleChange(event) {
        // Note the `+`: it converts string to int.
        const value = +event.target.value;
        this.props.updatePreference(this.fieldName, value);
        this.setState({length: value});
    }

    render() {
        return (
            <PreferenceField fieldData={this.fieldData} toggle={this.toggle}>
                <input className="slider has-output" step="100" min="100" max="10000"
                       value={this.state.length}
                       onChange={this.handleChange}
                       id="routeLengthSlider"
                       type="range"/>
                <span style={{display: 'inline-block', width: '3rem'}}>{this.state.length}</span>
            </PreferenceField>
        );
    }
}
