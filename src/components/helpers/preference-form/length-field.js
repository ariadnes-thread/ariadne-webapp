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
    };

    constructor(props) {
        super(props);

        this.fieldData = PreferenceSchema.length;
        this.fieldName = this.fieldData.name;
        this.toggle = this.toggle.bind(this);
    }

    toggle(enabled) {
        const value = 123;
        if (enabled) this.props.updatePreference(this.fieldName, value);
        else this.props.updatePreference(this.fieldName, null);
    }

    render() {
        return (
            <PreferenceField fieldData={this.fieldData} toggle={this.toggle}>
                <input className="slider is-disabled is-fullwidth" step="1" min="0" max="100"
                       value="50"
                       type="range"/>
            </PreferenceField>
        );
    }
}
