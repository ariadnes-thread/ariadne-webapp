/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import PropTypes from 'prop-types';
import React, {Component} from 'react';
import fontawesome from '@fortawesome/fontawesome';
import faFreeSolid from '@fortawesome/fontawesome-free-solid';

import RouteVisualiser from './route-visualiser';
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
                <RouteVisualiser auth={this.props.auth}/>
            </div>
        );
    }
}
