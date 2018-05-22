/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import ReactTags from 'react-tag-autocomplete';
import 'react-select/dist/react-select.css';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import _ from 'lodash';

import {PreferenceSchema, PoiTypes} from '../../../util/preferences-state';
import PreferenceField from './preference-field';

export default class PoiField extends Component {

    static propTypes = {
        currentPrefState: PropTypes.any.isRequired,
        updatePreference: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.fieldData = PreferenceSchema.pointsOfInterest;
        this.fieldName = this.fieldData.name;

        this.state = {
            poiOptions: [],
            poiSelectValue: [],
        };

        const initialPois = this.props.currentPrefState.get(this.fieldName);
        _.forEach(PoiTypes, (poiType) => {
            const optionObject = {value: poiType.name, label: poiType.displayName};
            this.state.poiOptions.push(optionObject);
            if (initialPois[poiType.name]) {
                this.state.poiSelectValue.push(optionObject);
            }
        });

        this.toggle = this.toggle.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    toggle(enabled) {
        if (enabled) this.props.updatePreference(this.fieldName, PoiField.getPoisObject(this.state.poiSelectValue));
        else this.props.updatePreference(this.fieldName, null);
    }

	onChange(value) {
		this.setState({poiSelectValue: value});
		console.log('Numeric Select value changed to', value);
    } 

    componentWillUpdate(nextProps, nextState) {
        this.props.updatePreference(this.fieldName, PoiField.getPoisObject(nextState.poiSelectValue));
    }

    static getPoisObject(selectValue) {
        const poiObject = {};
        for (const option of selectValue) {
            poiObject[option.value] = 1;
        }
        return poiObject;
    }

    render() {
        return (
            <PreferenceField fieldData={this.fieldData} toggle={this.toggle}>
                <div className="has-text-left is-size-7">
                    <Select
                        options={this.state.poiOptions}
                        value={this.state.poiSelectValue}
                        onChange={this.onChange}
                        matchPos="any"
                        multi={true}/>
                </div>
            </PreferenceField>
        );
    }
}
