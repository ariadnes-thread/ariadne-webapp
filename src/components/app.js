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
import swal from 'sweetalert2'
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
        this.state = {
            overallZoom: 16,
            overallCenter: {lat: 34.138932, lng: -118.125339},
            BikeOrRun: "bike",
            LoopOrP2P: "loop",
            distance: [true, 0, 10],
            time: [false, 0, 60],
            start: "location",
            end: "location",
            startLoc: {lat: 34.138932, lng: -118.125339},
            endLoc: {lat: 34.138932, lng: -118.125339},
            elevation: [true, 0, 1000],
            setting: "urban",
            node: [],
            edge: []
        };
    }


    getPrefs() {
        return this.state;
    }

    setPrefs(newState) {
        this.setState(...this.state, newState);
    }
}

export default class App extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
    };

    constructor(props) {
        super(props);

        this.preferencesState = new PreferencesState();

        // this.state = {
        //     jsonInput: EXAMPLE_ROUTE_JSON,
        //     route: null,
        //     geometry: null,
        // };

        // this.visualizeRoute = this.visualizeRoute.bind(this);
        // this.selectedZip = 0;

    }


    render() {
        return (
            <div className="App">
                <script src={this.props.auth.getGoogleApiUrl()}/>
                <Navbar auth={this.props.auth}/>
                <Switch>
                    <Route path="/debug" component={(props) => <DebugPanel {...props} auth={this.props.auth}/>}/>
                    <Route path="/login" component={(props) => <LoginPanel {...props} auth={this.props.auth}/>}/>
                    <Route path="/preferences" component={(props) => <PreferencesSelection
                        {...props} preferencesState={this.preferencesState} auth={this.props.auth}/>}/>
                    <Route path="/preferences-sentence" component={(props) => <PreferencesSentence {...props} auth={this.props.auth}/>}/>
                    <Route path="/saved" component={(props) => <SavedRoutes {...props} auth={this.props.auth}/>}/>
                    <Route exact path="/" component={(props) => <RouteVisualiser
                        {...props} preferencesState={this.preferencesState} auth={this.props.auth}/>}/>
                    <Route><Redirect to="/preferences-sentence"/></Route>
                </Switch>
            </div>
        );
    }
}
