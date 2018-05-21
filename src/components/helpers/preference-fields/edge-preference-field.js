/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {PreferenceSchema, EdgeTypes} from '../../../util/preferences-state';
import PreferenceField from './preference-field';

export default class EdgePreferenceField extends Component {

    static propTypes = {
        currentPrefState: PropTypes.any.isRequired,
        updatePreference: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.fieldData = PreferenceSchema.edgePreference;
        this.fieldName = this.fieldData.name;

        const roadPref = {};
        _.forIn(EdgeTypes, edgeType => {
            const bool = !!this.fieldData.defaultValue[edgeType.name];
            roadPref[edgeType.name] = bool;
        });

        this.state = {
            roadPref,
        };

        this.toggle = this.toggle.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
    }

    getEdgePrefObject() {
        const edgePref = {...this.state.roadPref};
        _.forIn(edgePref, (value, key) => {
            edgePref[key] = value ? 1.0: 0.0; 
        });
        return edgePref;
    }

    componentDidUpdate() {
        // TODO: Don't update if the prefernce is disabled?
        this.props.updatePreference(this.fieldName, this.getEdgePrefObject());
    }

    toggle(enabled) {
        if (enabled) this.props.updatePreference(this.fieldName, this.getEdgePrefObject());
        else this.props.updatePreference(this.fieldName, {});
    }

    handleInputChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			roadPref: {
				...this.state.roadPref,
				[name]: value,
			},
		});
    }

    renderCheckboxes() {
        const components = [];

        _.forIn(EdgeTypes, edgeType => {
            const key = `edge-type-checkbox-${edgeType.name}`;
            components.push(<div key={key} className="control">
                <input className="is-checkradio" name={edgeType.name} value={this.state.roadPref[edgeType.name]} id={key} type="checkbox" onChange={this.handleInputChange}/>
                <label htmlFor={key}>{edgeType.displayName}</label>
            </div>);
        });

        return <div className="field is-grouped is-grouped-multiline is-grouped-right">{components}</div>;
    }

    render() {
        return (
            <PreferenceField fieldData={this.fieldData} toggle={this.toggle}>
                <div className="has-text-left is-size-7">
                    {this.renderCheckboxes()}
                </div>
            </PreferenceField>
        );
    }
}
