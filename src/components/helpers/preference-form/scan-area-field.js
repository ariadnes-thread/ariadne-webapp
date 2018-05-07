/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {PreferenceSchema} from '../../../util/preferences-state';
import PreferenceField from './preference-field';

export default class ScanAreaField extends Component {

    static propTypes = {
        updatePreference: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.fieldData = PreferenceSchema.scanArea;
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
                <div className="select is-medium">
                    <select disabled>
                        <option>Currently visible map</option>
                    </select>
                </div>
            </PreferenceField>
        );
    }
}
