/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import _ from 'lodash';

import TransportTypeField from '../components/helpers/preference-fields/transport-type-field';
import ScanAreaField from '../components/helpers/preference-fields/scan-area-field';
import LengthField from '../components/helpers/preference-fields/length-field';
import RouteTypeField from '../components/helpers/preference-fields/route-type-field';

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
        enabledByDefault: false,
        defaultValue: ScanArea.CurrentlyVisibleMap,
        formComponent: ScanAreaField,
    },
    length: {
        name: 'length',
        displayName: 'Length',
        description: null,
        enabledByDefault: true,
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
    origins: {
        name: 'origins',
        hiddenFromEditor: true,
        defaultValue: [{
            latitude: 34.149638,
            longitude: -118.132412,
        }],
    },
    destinations: {
        name: 'destinations',
        hiddenFromEditor: true,
        defaultValue: [{
            latitude: 34.113537,
            longitude: -118.071555,
        }],
    },
};

export default class PreferencesState {

    constructor() {
        this.preferences = {};
        this.updateListeners = [];

        _.forIn(PreferenceSchema, (value, key) => {
            this.preferences[key] = value.defaultValue;
        });
    }

    /**
     * @param {function} listener
     * @param {object} options
     * @param {boolean} options.forceUpdate Sends all current values of preferences to the listener as if they were just
     * updated.
     */
    addUpdateListener(listener, options = {}) {
       this.updateListeners.push(listener);

       if (options.forceUpdate) {
           _.forIn(this.preferences, (value, key) => {
               listener({name: key, value});
           });
       }
    }

    get(name) {
        return this.preferences[name];
    }

    set(name, value) {
        this.preferences[name] = value;

        for (const updateListener of this.updateListeners) {
            updateListener({name, value});
        }
    }

    getPrefsFormattedForApi() {
        return {
            desired_dist: this.preferences.length,
            origins: this.preferences.origins,
            dests: this.preferences.destinations,
            poi_prefs: {},
            edge_prefs: {},
            noptions: 2,
        };
    }

}
