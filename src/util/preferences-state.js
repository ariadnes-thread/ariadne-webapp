/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import _ from 'lodash';

import TransportTypeField from '../components/helpers/preference-form/transport-type-field';
import ScanAreaField from '../components/helpers/preference-form/scan-area-field';
import LengthField from '../components/helpers/preference-form/length-field';
import RouteTypeField from '../components/helpers/preference-form/route-type-field';

/** @enum {string} */
export const TransportType = {
    Bike: 'bike',
    Walk: 'walk',
    Run: 'run',
};

/** @enum {string} */
export const ScanArea = {
    CurrentlyVisibleMap: 'visible-map',
    Custom: 'custom',
};

/** @enum {string} */
export const RouteType = {
    PointToPoint: 'point-to-point',
    Loop: 'loop',
};

/**
 * This schema defines all preferences and any relevant meta data.
 */
export const PreferenceSchema = {
    transportType: {
        name: 'transportType',
        displayName: 'Activity',
        description: null,
        enabledByDefault: true,
        defaultValue: TransportType.Walk,
        formComponent: TransportTypeField,
    },
    scanArea: {
        name: 'scanArea',
        displayName: 'Scan area',
        description: 'Scan area defines the region of the map which our route planner will consider when generating' +
        ' your route.',
        enabledByDefault: true,
        defaultValue: ScanArea.CurrentlyVisibleMap,
        formComponent: ScanAreaField,
    },
    length: {
        name: 'length',
        displayName: 'Length',
        description: null,
        enabledByDefault: false,
        defaultValue: 5000.0,
        formComponent: LengthField,
    },
    routeType: {
        name: 'routeType',
        displayName: 'Route type',
        description: null,
        enabledByDefault: true,
        defaultValue: RouteType.PointToPoint,
        formComponent: RouteTypeField,
    },
};

export default class PreferencesState {

    constructor() {
        this.preferences = {};

        _.forIn(PreferenceSchema, (value, key) => {
            this.preferences[key] = value.defaultValue;
        });
    }

    set(name, value) {
        this.preferences[name] = value;
    }

    getPrefsFormattedForApi() {
        return {
            desiredLength: this.preferences.length,
            origin: {
                longitude: this.preferences.origin.lng,
                latitude: this.preferences.origin.lat,
            },
            destination: {
                longitude: this.preferences.destination.lng,
                latitude: this.preferences.destination.lat,
            },
        };
    }

}
