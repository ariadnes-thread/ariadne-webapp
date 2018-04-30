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

fontawesome.library.add(faFreeSolid);

export default class App extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
    };

    // constructor(props) {
    //     super(props);

    //     // this.state = {
    //     //     jsonInput: EXAMPLE_ROUTE_JSON,
    //     //     route: null,
    //     //     geometry: null,
    //     // };

    //     // this.visualizeRoute = this.visualizeRoute.bind(this);
    //     // this.selectedZip = 0;

    //     if (this.props.auth.isAuthenticated() && window.location === "/")
    //     {
    //         swal({
    //           title: 'Welcome!!',
    //           text: 'Create a new route, or revisit an old route (and rate it!)',
    //           type: 'success',
    //           showCancelButton: true,
    //           confirmButtonText: 'New Route',
    //           cancelButtonText: 'Saved Route',
    //           allowOutsideClick: false,
    //           allowEscapeKey: false
    //         }).then((result) => {
    //             if (result.value)
    //             {
    //                 swal({
    //                     title: 'Tell us your preferences!',
    //                     type: 'question',
    //                     text: 'Start by telling us about your ideal route:',
    //                     allowOutsideClick: false,
    //                     allowEscapeKey: false
    //                 }).then((res) => {
    //                     window.location = '/preferences';
    //                     console.log(res);
    //                 });
    //             }
    //             else if (result.dismiss === swal.DismissReason.cancel)
    //             {
    //                 window.location = '/saved';
    //                 // swal("TODO: Redirect the user to their saved routes page");
    //             }
    //         }
    //         );
    //     }
    //     else {
    //         swal({
    //           title: 'Error!',
    //           text: 'Please log in:',
    //           type: 'error',
    //           allowOutsideClick: false,
    //           allowEscapeKey: false,
    //           confirmButtonText: 'Go to Log In page'
    //         }).then(() => window.location='/login');
    //     }
    // }


// instead of passing methods back and forth, create a new class thats called preferencesstate and just pass that instance around
// so that it is the same in preferencesselection and routevisualizer
// the routes can just be internal to the vis, upon redoing stuff make sure to delete old routes
 
    getPrefs() {

    }

    setPrefs() {

    }

    render() {
        return (
            <div className="App">
                <script src={this.props.auth.getGoogleApiUrl()}/>
                <Navbar auth={this.props.auth}/>
                <Switch>
                    <Route path="/debug" component={(props) => <DebugPanel {...props} auth={this.props.auth}/>}/>
                    <Route path="/login" component={(props) => <LoginPanel {...props} auth={this.props.auth}/>}/>
                    <Route path="/preferences" component={(props) => <PreferencesSelection {...props} auth={this.props.auth}/>}/>
                    <Route path="/saved" component={(props) => <SavedRoutes {...props} auth={this.props.auth}/>}/>
                    <Route exact path="/" component={(props) => <RouteVisualiser {...props} auth={this.props.auth}/>}/>
                    <Route><Redirect to="/"/></Route>
                </Switch>
            </div>
        );
    }
}
