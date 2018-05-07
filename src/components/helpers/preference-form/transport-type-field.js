/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {PreferenceSchema} from '../../../util/preferences-state';
import PreferenceField from './preference-field';
import IconButton from '../icon-button';

export default class TransportTypeField extends Component {

    static propTypes = {
        updatePreference: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.fieldData = PreferenceSchema.transportType;
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
                <div className="buttons has-addons is-right">
                    <IconButton icon="male" size="medium" type="info" active>
                        Walk
                    </IconButton>
                    <IconButton icon="child" size="medium">Run</IconButton>
                    <IconButton icon="bicycle" size="medium">&nbsp;Cycle</IconButton>
                </div>
            </PreferenceField>
        );
    }
}
