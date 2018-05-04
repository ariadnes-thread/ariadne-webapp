/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @author Mary Giambrone
 * @copyright 2018
 * @license GPL-3.0
 */

import {Switch, Route, Redirect, BrowserRouter} from 'react-router-dom';
import faFreeSolid from '@fortawesome/fontawesome-free-solid';
import fontawesome from '@fortawesome/fontawesome';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import PreferencesSelection from './preferences-selection';
import PreferencesState from '../util/preferences-state';
import RouteVisualiser from './route-visualiser';
import RouteCustomizer from './views/route-customizer';
import SavedRoutes from './saved-routes';
import DebugPanel from './views/debug-panel';
import LoginPanel from './views/login-panel';
import Auth from '../util/auth';
import Navbar from './helpers/navbar';
import Home from './views/home';

fontawesome.library.add(faFreeSolid);

export default class App extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
    };

    constructor(props) {
        super(props);

        this.preferencesState = new PreferencesState();
    }


    render() {
        return (
            <BrowserRouter basename={this.props.auth.config.baseUri}>
                <div className="ariadne-app">
                    <script src={this.props.auth.getGoogleApiUrl()}/>
                    <Navbar auth={this.props.auth}/>
                    <Switch>
                        <Route path="/debug" component={(props) => <DebugPanel {...props} auth={this.props.auth}/>}/>

                        <Route path="/login" component={(props) => <LoginPanel {...props} auth={this.props.auth}/>}/>

                        <Route path="/plan-route" component={(props) => <RouteCustomizer
                            {...props} preferencesState={this.preferencesState} auth={this.props.auth}/>}/>

                        <Route path="/saved" component={(props) => <SavedRoutes {...props} auth={this.props.auth}/>}/>

                        <Route path="/view-route" component={(props) => <RouteVisualiser
                        {...props} preferencesState={this.preferencesState} auth={this.props.auth}/>}/>

                        <Route exact path="/" component={(props) => <Home{...props} />}/>

                        <Route><Redirect to="/"/></Route>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}
