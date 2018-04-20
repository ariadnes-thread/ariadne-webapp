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
import DebugPanel from './debug-panel';
import LoginPanel from './login-panel';
import Auth from '../util/auth';
import Navbar from './navbar';

fontawesome.library.add(faFreeSolid);

export default class App extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
    };

    render() {
        return (
            <div className="App">
                <script src={this.props.auth.getGoogleApiUrl()}/>
                <Navbar auth={this.props.auth}/>
                <Switch>
                    <Route path="/debug" component={(props) => <DebugPanel {...props} auth={this.props.auth}/>}/>
                    <Route path="/login" component={(props) => <LoginPanel {...props} auth={this.props.auth}/>}/>
                    <Route exact path="/" component={(props) => <RouteVisualiser {...props} auth={this.props.auth}/>}/>
                    <Route><Redirect to="/"/></Route>
                </Switch>
            </div>
        );
    }
}
