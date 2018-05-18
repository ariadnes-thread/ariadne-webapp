/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import ReactTags from 'react-tag-autocomplete';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
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
            tags: [],
            suggestions: [],
        };

        const initialPois = this.props.currentPrefState.get(this.fieldName);
        _.forEach(PoiTypes, (poiType) => {
            const tagObject = {id: poiType.name, name: poiType.displayName};
            if (initialPois[poiType.name]) {
                this.state.tags.push(tagObject);
            } else {
                this.state.suggestions.push(tagObject);
            }
        });

        this.toggle = this.toggle.bind(this);
    }

    toggle(enabled) {
        const value = 123;
        if (enabled) this.props.updatePreference(this.fieldName, value);
        else this.props.updatePreference(this.fieldName, null);
    }

    handleDelete(i) {
        const tags = this.state.tags.slice(0);
        tags.splice(i, 1);
        this.setState({tags});
    }

    handleAddition(tag) {
        const tags = [].concat(this.state.tags, tag);
        this.setState({tags});
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.tags !== nextState.tags) {
            const newObject = {};
            for (const tag of nextState.tags) {
                newObject[tag.id] = 1;
            }
            this.props.updatePreference(this.fieldName, newObject);
        }
    }

    render() {
        return (
            <PreferenceField fieldData={this.fieldData} toggle={this.toggle}>
                <div className="has-text-left is-size-6">
                    <ReactTags
                        tags={this.state.tags}
                        suggestions={this.state.suggestions}
                        handleDelete={this.handleDelete.bind(this)}
                        handleAddition={this.handleAddition.bind(this)}/>
                </div>
            </PreferenceField>
        );
    }
}
