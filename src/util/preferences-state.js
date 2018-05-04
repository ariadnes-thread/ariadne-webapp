/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

export default class PreferencesState {

    constructor() {

        this.routeMode = {'bike': 1, 'run': 2, 'walk': 3};
        this.routeType = {'loop': 1, 'pointToPoint': 2, 'walk': 3};
        this.setting = {'urban': 1, 'rural': 2, 'suburban': 3};
        this.edgeType = {'bikePath': 1, 'green': 2, 'paved': 3};
        this.nodeType = {'park': 1, 'bus': 2, 'coffee': 3, 'landmark': 4, 'restaurant': 5, 'mall': 6};
        this.start = {'specific': 1, 'type': 2};
        this.end = {'specific': 1, 'type': 2};
        this.preferences = {
            overallZoom: 16,
            overallCenter: {lat: 34.138932, lng: -118.125339},
            routeMode: this.routeMode.bike,
            routeType: this.routeType.loop,
            distance: {userEnabled: true, min: 0, max: 10},
            time: {userEnabled: false, min: 0, max: 60},
            start: this.start.specific,
            end: this.end.specific,
            startLoc: {lat: 34.138932, lng: -118.125339},
            endLoc: {lat: 34.138932, lng: -118.125339},
            startType: this.nodeType.bus,
            endType: this.nodeType.park,
            elevation: {userEnabled: true, min: 0, max: 1000},
            setting: this.setting.urban,
            node: [],
            edge: []
        };
    }

    getPrefs() {
        return this.preferences;
    }

    setPrefs(newState) {
        console.log('In App.js, calling PreferencesState.setPrefs');
        console.log('new state is', newState);
        this.preferences = newState;
    }
}
