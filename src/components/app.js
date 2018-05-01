/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @author Mary Giambrone
 * @copyright 2018
 * @license GPL-3.0
 */

import faFreeSolid from '@fortawesome/fontawesome-free-solid';
import fontawesome from '@fortawesome/fontawesome';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Switch, Route, Redirect} from 'react-router-dom';

import RouteVisualiser from './route-visualiser';
import SavedRoutes from './saved-routes';
import PreferencesSelection from './preferences-selection';
import DebugPanel from './debug-panel';
import LoginPanel from './login-panel';
import Auth from '../util/auth';
import Navbar from './navbar';
import PreferencesSentence from "./preferences-sentence";

fontawesome.library.add(faFreeSolid);

class PreferencesState extends Component {

// instead of passing methods back and forth, create a new class thats called preferencesstate and just pass that instance around
// so that it is the same in preferencesselection and routevisualizer
// the routes can just be internal to the vis, upon redoing stuff make sure to delete old routes
    constructor(props) {
        super(props);

        this.routeMode = {"bike" : 1, "run" : 2, "walk" : 3};
        this.routeType = {"loop" : 1, "pointToPoint" : 2, "walk" : 3};
        this.setting = {"urban" : 1, "rural" : 2, "suburban" : 3};
        this.edgeType = {"bikePath" : 1, "green" : 2, "paved" : 3};
        this.nodeType = {"park" : 1, "bus" : 2, "coffee" : 3 , "landmark" : 4, "restaurant" : 5, "mall" : 6};
        this.start = {"specific" : 1, "type" : 2};
        this.end = {"specific" : 1, "type" : 2};
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
        console.log("In App.js, calling PreferencesState.setPrefs");
        console.log("new state is", newState);
        this.preferences = newState;
    }
}

export default class App extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
    };

    constructor(props) {
        super(props);

        this.preferencesState = new PreferencesState();
    }


    render() {
        console.log("At app level, preferences are", this.preferencesState.getPrefs());
        return (
            <div className="App">
                <script src={this.props.auth.getGoogleApiUrl()}/>
                <Navbar auth={this.props.auth}/>
                <Switch>
                    <Route path="/debug" component={(props) => <DebugPanel {...props} auth={this.props.auth}/>}/>
                    <Route path="/login" component={(props) => <LoginPanel {...props} auth={this.props.auth}/>}/>
                    <Route path="/preferences" component={(props) => <PreferencesSelection
                        {...props} preferencesState={this.preferencesState} auth={this.props.auth}/>}/>
                    <Route path="/preferences-sentence" component={(props) => <PreferencesSentence
                        {...props} preferencesState={this.preferencesState} auth={this.props.auth}/>}/>
                    <Route path="/saved" component={(props) => <SavedRoutes {...props} auth={this.props.auth}/>}/>
                    <Route exact path="/" component={(props) => <RouteVisualiser
                        {...props} preferencesState={this.preferencesState} auth={this.props.auth}/>}/>
                    <Route><Redirect to="/preferences-sentence"/></Route>
                </Switch>
            </div>
        );
    }
}
