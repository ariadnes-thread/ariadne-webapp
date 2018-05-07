/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import PreferencesState, {PreferenceSchema} from '../../util/preferences-state';
import Util from '../../util/util';
import Card from './card';

export default class PreferenceEditor extends Component {

    static propTypes = {
        submitPreferences: PropTypes.func, // Optional, but nothing will happen on submit if this is not provided
        initialPrefState: PropTypes.instanceOf(PreferencesState), // Optional, used if parent extracted from localStorage
    };

    constructor(props) {
        super(props);

        if (this.props.initialPrefState) this.prefState = this.props.initialPrefState;
        else this.prefState = new PreferencesState();

        this.updatePreference = this.updatePreference.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    resetPreferences() {
        this.prefState = new PreferencesState();
        this.forceUpdate();
    }

    /**
     * @param {string} preferenceName
     * @param {*} value This could be a string, an object, a latlong, or anything else depending on the preference.
     */
    updatePreference(preferenceName, value) {
        this.prefState.set(preferenceName, value);
    }

    handleSubmit(event) {
        event.preventDefault();
        // TODO: Replace with actual data
        if (this.props.submitPreferences) this.props.submitPreferences(this.prefState);
        else Util.logWarn(`No 'submitPreferences()' function has been supplied, doing nothing on form submit.`);
    }

    renderFields() {
        let i = 0;
        const components = [];
        for (const preferenceName in PreferenceSchema) {
            if (!PreferenceSchema.hasOwnProperty(preferenceName)) continue;

            const preferenceData = PreferenceSchema[preferenceName];
            const FormComponent = preferenceData.formComponent;
            const initialValue = this.prefState.get(preferenceName);
            components.push(<FormComponent updatePreference={this.updatePreference}
                                           initialValue={initialValue} key={i++}/>);
            components.push(<div key={i++} className="ariadne-divider"/>);
        }
        return components;
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <Card>
                    <p>You're almost there! Tell us about your preferences to help us find a perfect route
                        for you. If you care about a particular route feature, turn it on and specify a
                        value. Click "Generate route" once you're done!</p>
                </Card>
                <Card>
                    {this.renderFields()}

                    <button className="button is-large is-fullwidth is-success">Generate route</button>
                </Card>
            </form>
        );
    }
}
