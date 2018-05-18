/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Promise from 'bluebird';
import {TweenMax} from 'gsap';

import PreferencesState, {PreferenceSchema} from '../../util/preferences-state';
import Util from '../../util/util';
import Card from './card';

export default class PreferenceEditor extends Component {

    static propTypes = {
        prefState: PropTypes.instanceOf(PreferencesState).isRequired,
        submitPreferences: PropTypes.func, // Optional, but nothing will happen on submit if this is not provided
        requestNextMapClick: PropTypes.func,
    };

    constructor(props) {
        super(props);

        if (this.props.prefState) this.prefState = this.props.prefState;
        else throw new Error('No `prefState` specified in PreferenceEditor props!');

        this.state = {
            submitting: false,
        };

        this.containerRef = React.createRef();
        this.updatePreference = this.updatePreference.bind(this);
        this.requestNextMapClickFromParent = this.requestNextMapClickFromParent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillEnter(callback) {
        TweenMax.fromTo(this.containerRef.current, 0.3,
            {x: -200, opacity: 0, position: 'absolute'},
            {x: 0, opacity: 1, position: 'relative', onComplete: callback}
        );
    }

    componentWillLeave(callback) {
        TweenMax.fromTo(this.containerRef.current, 0.3,
            {x: 0, opacity: 1, top: 0, position: 'absolute'},
            {x: -200, opacity: 0, onComplete: callback}
        );
    }

    /**
     * @param {string} preferenceName
     * @param {*} value This could be a string, an object, a latlong, or anything else depending on the preference.
     */
    updatePreference(preferenceName, value) {
        this.prefState.set(preferenceName, value);
    }

    /**
     * Check documentation for `requestNextMapClick()` in the parent object for details.
     */
    requestNextMapClickFromParent(data) {
        if (this.props.requestNextMapClick) {
            return this.props.requestNextMapClick(data);
        }

        return Promise.reject(new Error(`No 'requestNextMapClick()' prop was passed to PreferenceEditor component.`));
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.props.submitPreferences) {
            Promise.resolve()
                .then(() => this.setState({submitting: true}))
                .then(() => this.props.submitPreferences(this.prefState))
                .catch(error => Util.showErrorModal({
                    message: 'An error occurred while visualising your route.',
                    console: error,
                }))
                .finally(() => this.setState({submitting: false}));
        }
        else {
            Util.logWarn(`No 'submitPreferences()' function has been supplied through props, doing nothing on form submit.`);
        }
    }

    renderFields() {
        let i = 0;
        const components = [];
        for (const preferenceName in PreferenceSchema) {
            if (!PreferenceSchema.hasOwnProperty(preferenceName)) continue;
            const preferenceData = PreferenceSchema[preferenceName];

            if (preferenceData.hiddenFromEditor) continue;

            const FormComponent = preferenceData.formComponent;
            const initialValue = this.prefState.get(preferenceName);
            components.push(<FormComponent updatePreference={this.updatePreference}
                                           requestNextMapClick={this.requestNextMapClickFromParent}
                                           currentPrefState={this.prefState}
                                           initialValue={initialValue} key={i++}/>);
            components.push(<div key={i++} className="ariadne-divider"/>);
        }
        return components;
    }

    render() {
        let generateButtonClass = 'button is-large is-fullwidth is-success';
        if (this.state.submitting) generateButtonClass += ' is-loading';

        return (
            <form ref={this.containerRef} onSubmit={this.handleSubmit} style={{minWidth: '100%'}}>
                <Card>
                    <p>You're almost there! Tell us about your preferences to help us find a perfect route
                        for you. If you care about a particular route feature, turn it on and specify a
                        value. Click "Generate route" once you're done!</p>
                </Card>
                <Card>
                    {this.renderFields()}

                    <button ref="genRoute" className={generateButtonClass}>Generate route</button>
                </Card>
            </form>
        );
    }
}
