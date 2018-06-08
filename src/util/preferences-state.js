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
    atm: {name: 'atm', displayName: 'ATMs', icon: 'dollar-sign'},
    bakery: {name: 'bakery', displayName: 'Bakeries', icon: 'birthday-cake'},
    bank: {name: 'bank', displayName: 'Banks', icon: 'university'},
    busStation: {name: 'bus_station', displayName: 'Bus stations', icon: 'bus'},
    cafe: {name: 'cafe', displayName: 'Cafes', icon: 'coffee'},
    church: {name: 'church', displayName: 'Churchs', icon: 'church'},
    gasStation: {name: 'gas_station', displayName: 'Gas stations', icon: 'gas-pump'},
    gym: {name: 'gym', displayName: 'Gyms', icon: 'basketball-ball'},
    hairCare: {name: 'hair_care', displayName: 'Hair care', icon: 'user-astronaut'},
    library: {name: 'library', displayName: 'Libraries', icon: 'book'},
    park: {name: 'park', displayName: 'Parks', icon: 'tree'},
    parking: {name: 'parking', displayName: 'Parking', icon: 'parking'},
    pharmacy: {name: 'pharmacy', displayName: 'Pharmacy', icon: 'medkit'},
    store: {name: 'store', displayName: 'Stores', icon: 'store-alt'},
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
    routeType: {
        name: 'routeType',
        displayName: 'Route type',
        description: null,
        enabledByDefault: true,
        defaultValue: RouteType.PointToPoint,
        formComponent: RouteTypeField,
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
    origin: {
        name: 'origin',
        hiddenFromEditor: true,
        defaultValue: {
            latitude: 34.149638,
            longitude: -118.132412,
        },
    },
    destination: {
        name: 'destination',
        hiddenFromEditor: true,
        defaultValue: {
            latitude: 34.146,
            longitude: -118.121,
        },
    },
};

export default class PreferencesState {

    constructor() {
        this.preferences = {};
        this.enabled = {};

        this.updateListeners = [];
        this.enableListeners = [];

        _.forIn(PreferenceSchema, (value, key) => {
            this.preferences[key] = value.defaultValue;
            this.enabled[key] = value.enabledByDefault;
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

    /**
     * @param {function} listener
     * @param {object} options
     * @param {boolean} options.forceUpdate Sends all current values of preferences to the listener as if they were just
     * updated.
     */
    addEnableListener(listener, options = {}) {
        this.enableListeners.push(listener);

        if (options.forceUpdate) {
            _.forIn(this.enabled, (value, key) => {
                listener({name: key, enabled: value});
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

    isEnabled(name) {
        return this.enabled[name];
    }

    enable(name) {
        this.enabled[name] = true;

        for (const enableListener of this.enableListeners) {
            enableListener({name, enabled: this.enabled[name]});
        }
    }

    disable(name) {
        this.enabled[name] = false;

        for (const enableListener of this.enableListeners) {
            enableListener({name, enabled: this.enabled[name]});
        }
    }

    getPrefsFormattedForApi() {
        const constraints = {
            origin: this.preferences.origin ? this.preferences.origin : PreferenceSchema.origin.defaultValue,
            dest: this.preferences.destination ? this.preferences.destination : PreferenceSchema.destination.defaultValue,
            edge_prefs: this.enabled.edgePreference ? this.preferences.edgePreference : {},
        };
        if (constraints.origin && constraints.dest) {
            const maxLat = Math.max(constraints.origin.latitude, constraints.dest.latitude);
            const minLat = Math.min(constraints.origin.latitude, constraints.dest.latitude);
            const maxLng = Math.max(constraints.origin.longitude, constraints.dest.longitude);
            const minLng = Math.min(constraints.origin.longitude, constraints.dest.longitude);
            const buffer = 0.2;
            constraints.bbox = {
                xmin: minLng - buffer,
                ymin: minLat - buffer,
                xmax: maxLng + buffer,
                ymax: maxLat + buffer,
            };
        }
        if (this.enabled.length && this.preferences.length)
            constraints.desired_dist = this.preferences.length;
        if (this.enabled.pointsOfInterest && this.preferences.pointsOfInterest)
            constraints.poi_prefs = this.preferences.pointsOfInterest;

        return constraints;
    }

}
