/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {PreferenceSchema} from '../../../util/preferences-state';
import PreferenceField from './preference-field';
import Util from '../../../util/util';

const LocationButtonType = {
    PickOriginOnMap: 'pick-origin-on-map',
    PickDestinationOnMap: 'pick-destination-on-map',
};

export default class RouteTypeField extends Component {

    static propTypes = {
        currentPrefState: PropTypes.any.isRequired,
        updatePreference: PropTypes.func.isRequired,
        requestNextMapClick: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        /** @var {PreferencesState} */
        this.prefState = this.props.currentPrefState;
        const origin = this.prefState.get(PreferenceSchema.origin.name);
        const destination = this.prefState.get(PreferenceSchema.destination.name);

        this.fieldData = PreferenceSchema.routeType;
        this.fieldName = this.fieldData.name;
        this.state = {
            routeType: this.prefState.get(this.fieldName),
            enabled: this.fieldData.enabledByDefault,
            originCoordsText: `${origin.latitude.toFixed(3)}, ${origin.longitude.toFixed(3)}`,
            destCoordsText: `${destination.latitude.toFixed(3)}, ${destination.longitude.toFixed(3)}`,
        };

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

        let message;
        if (locButtonType === LocationButtonType.PickOriginOnMap) {
            message = 'Click somewhere on the map to specify your starting point';
        } else if (locButtonType === LocationButtonType.PickDestinationOnMap) {
            message = 'Click somewhere on the map to specify your destination';
        } else {
            return Util.showErrorModal({console: 'Unrecognised LocationButtonType in RouteTypeField!'});
        }

        this.props.requestNextMapClick({message})
            .then(clickEvent => {
                // Our promise has been cancelled by someone else.
                if (clickEvent === false) return;

                const latlng = clickEvent.latlng;
                const latlngText = `${latlng.lat.toFixed(3)}, ${latlng.lng.toFixed(3)}`;
                const prefObject = {
                    latitude: latlng.lat,
                    longitude: latlng.lng,
                };

                if (locButtonType === LocationButtonType.PickOriginOnMap) {
                    this.props.updatePreference(PreferenceSchema.origin.name, prefObject);
                    this.setState({originCoordsText: latlngText});
                } else if (locButtonType === LocationButtonType.PickDestinationOnMap) {
                    this.props.updatePreference(PreferenceSchema.destination.name, prefObject);
                    this.setState({destCoordsText: latlngText});
                }
            });
    }

    render() {
        return (
            <div>
                <PreferenceField fieldData={this.fieldData} toggle={this.toggle} toggleable={false}>
                    <div className="select">
                        <select disabled>
                            <option>Point to point</option>
                        </select>
                    </div>
                </PreferenceField>
                {this.state.enabled &&
                <div>
                    <div className="field is-horizontal">
                        <div className="field-label is-normal">
                            <label className="label">Start</label>
                        </div>
                        <div className="field-body">
                            <div className="field has-addons">
                                <div className="control">
                                    <input className="input" value={this.state.originCoordsText} readOnly type="text"
                                           placeholder="Postcode, address"/>
                                </div>
                                <div className="control">
                                    <button className="button is-info"
                                            onClick={event => this.onLocationButtonClick(LocationButtonType.PickOriginOnMap, event)}
                                    >Pick on the map
                                    </button>
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
                                    <input className="input" value={this.state.destCoordsText} readOnly type="text"
                                           placeholder="Postcode, address"/>
                                </div>
                                <div className="control">
                                    <button className="button is-info"
                                            onClick={event => this.onLocationButtonClick(LocationButtonType.PickDestinationOnMap, event)}
                                    >Pick on the map
                                    </button>
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
