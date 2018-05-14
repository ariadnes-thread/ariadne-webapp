/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {PreferenceSchema} from '../../../util/preferences-state';
import PreferenceField from './preference-field';

const LocationButtonType = {
    PickOriginOnMap: 'pick-origin-on-map',
    PickDestinationOnMap: 'pick-destination-on-map',
};

export default class RouteTypeField extends Component {

    static propTypes = {
        updatePreference: PropTypes.func.isRequired,
        requestNextMapClick: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.fieldData = PreferenceSchema.routeType;
        this.fieldName = this.fieldData.name;
        this.state = {
            routeType: this.fieldData.defaultValue,
            enabled: this.fieldData.enabledByDefault,
        };

        // Used to handle the result when `requestNextMapClick()` promise
        // resolves.
        this.nextMapClickId = null;

        this.toggle = this.toggle.bind(this);
        this.onLocationButtonClick = this.onLocationButtonClick.bind(this);
    }

    toggle(enabled) {
        if (enabled) this.props.updatePreference(this.fieldName, this.state.routeType);
        else this.props.updatePreference(this.fieldName, null);

        this.setState({enabled});
    }

    onLocationButtonClick(locButtonType, event) {
        event.preventDefault();
        this.props.requestNextMapClick();
    }

    render() {
        return (
            <div>
                <PreferenceField fieldData={this.fieldData} toggle={this.toggle}>
                    <div className="select is-medium">
                        <select disabled>
                            <option>Point to point</option>
                        </select>
                    </div>
                </PreferenceField>
                {this.state.enabled &&
                <div>
                    <br/>
                    <div className="field is-horizontal">
                        <div className="field-label is-normal">
                            <label className="label">Start</label>
                        </div>
                        <div className="field-body">
                            <div className="field has-addons">
                                <div className="control">
                                    <input className="input" type="text" placeholder="Postcode, address"/>
                                </div>
                                <div className="control">
                                    <button className="button is-info"
                                            onClick={event => this.onLocationButtonClick(LocationButtonType.PickOriginOnMap, event)}
                                            >Pick on the map</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="field is-horizontal">
                        <div className="field-label is-normal">
                            <label className="label">Finish</label>
                        </div>
                        <div className="field-body">
                            <div className="field has-addons">
                                <div className="control">
                                    <input className="input" type="text" placeholder="Postcode, address"/>
                                </div>
                                <div className="control">
                                    <button className="button is-info"
                                            onClick={event => this.onLocationButtonClick(LocationButtonType.PickDestinationOnMap, event)}
                                            >Pick on the map</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                }
            </div>
        );
    }
}
