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
        const apiKey = this.props.auth.config.googleApiKey;
        let googleApiScriptUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        googleApiScriptUrl += '&v=3.exp&libraries=geometry,drawing,places';
        return (
            <div className="App">
                <script src={googleApiScriptUrl}/>
                <Navbar auth={this.props.auth}/>
                <RouteVisualiser auth={this.props.auth}/>
            </div>
        );
    }
}
