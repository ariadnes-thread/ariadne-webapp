/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @author Mary Giambrone
 * @copyright 2018
 * @license GPL-3.0
 */

import faFreeSolid from '@fortawesome/fontawesome-free-solid';
import {Switch, Route, Redirect} from 'react-router-dom';
import fontawesome from '@fortawesome/fontawesome';
import {BrowserRouter} from 'react-router-dom';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import PreferencesSelection from './preferences-selection';
import PreferencesSentence from './preferences-sentence';
import PreferencesState from '../util/preferences-state';
import RouteVisualiser from './route-visualiser';
import SavedRoutes from './saved-routes';
import DebugPanel from './debug-panel';
import LoginPanel from './login-panel';
import Auth from '../util/auth';
import Navbar from './navbar';
import Home from './home';

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
                        {/*<Route exact path="/" component={(props) => <RouteVisualiser*/}
                        {/*{...props} preferencesState={this.preferencesState} auth={this.props.auth}/>}/>*/}
                        <Route exact path="/" component={(props) => <Home{...props} />}/>
                        <Route><Redirect to="/preferences-sentence"/></Route>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}
