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
import PoiField from '../components/helpers/preference-fields/poi-field';
import EdgePreferenceField from '../components/helpers/preference-fields/edge-preference-field';

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

/** @enum {string} */
export const PoiTypes = {
    atm: {name: 'atm', displayName: 'ATMs'},
    bakery: {name: 'bakery', displayName: 'Bakeries'},
    bank: {name: 'bank', displayName: 'Banks'},
    busStation: {name: 'bus_station', displayName: 'Bus stations'},
    cafe: {name: 'cafe', displayName: 'Cafes'},
    church: {name: 'church', displayName: 'Churchs'},
    gasStation: {name: 'gas_station', displayName: 'Gas stations'},
    gym: {name: 'gym', displayName: 'Gyms'},
    hairCare: {name: 'hair_care', displayName: 'Hair care'},
    library: {name: 'library', displayName: 'Libraries'},
    park: {name: 'park', displayName: 'Parks'},
    parking: {name: 'parking', displayName: 'Parking'},
    pharmacy: {name: 'pharmacy', displayName: 'Pharmacy'},
    store: {name: 'store', displayName: 'Stores'},
};

/** @enum {string} */
export const EdgeTypes = {
    green: {
        name: 'green',
        displayName: 'Roads rich in greenery',
    },
    popularity: {
        name: 'popularity',
        displayName: 'Popular roads',
    },
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
        hiddenFromEditor: true,
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
        min: 200,
        max: 10000,
        step: 100,
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
    pointsOfInterest: {
        name: 'pointsOfInterest',
        displayName: 'Points of interest',
        description: 'These define what you want to see on your route. For example, a Park, Gym, Cafe, or an ATM.',
        enabledByDefault: true,
        defaultValue: {
            [PoiTypes.atm.name]: 1.0,
            [PoiTypes.park.name]: 1.0,
        },
        formComponent: PoiField,
    },
    edgePreference: {
        name: 'edgePreference',
        displayName: 'Road preference',
        description: 'This prerenfece indicates the type of road you prefer.',
        enabledByDefault: true,
        defaultValue: {},
        formComponent: EdgePreferenceField,
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
        const constraints = {
            origins: this.preferences.origins ? this.preferences.origins : PreferenceSchema.origins.defaultValue,
            dests: this.preferences.destinations ? this.preferences.destinations : PreferenceSchema.destinations.defaultValue,
            noptions: 3,
            edge_prefs: this.preferences.edgePreference,
        };
        if (this.preferences.length) constraints.desired_dist = this.preferences.length;
        if (this.preferences.pointsOfInterest) constraints.poi_prefs = this.preferences.pointsOfInterest;

        return constraints;
    }

}
