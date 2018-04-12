/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Promise from 'bluebird';

import MapWithRoutes from './maps-with-routes';
import PreferencesList from './preferences-list';
import RoutesList from './routes-list';
import Auth from '../util/auth';

// Generate JSON for the example route and make formatting prettier
const EXAMPLE_ROUTE = {
    route: [
        [34.140930, -118.129366],
        [34.140947, -118.128010],
        [34.140388, -118.128002],
        [34.139434, -118.122862],
    ],
};
const EXAMPLE_ROUTE_JSON = JSON
    .stringify(EXAMPLE_ROUTE, null, 2)
    .replace(/\[\s+(-?\d+(.\d+)?),\s+(-?\d+(.\d+)?)\s+]/g, function () {
        // ^ this has to be `function` for `arguments` to work, doesn't work wih arrows function :/
        const lat = arguments[1];
        const lng = arguments[3];
        return `[${lat}, ${lng}]`;
    });


export default class RouteVisualiser extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            jsonInput: EXAMPLE_ROUTE_JSON,
            route: null,
        };

        this.visualizeRoute = this.visualizeRoute.bind(this);
    }


    visualizeRoute(routeData) {
        return Promise.resolve()
            .then(() => routeData ? routeData.route : null)
            .then(route => this.setState({route}));
    }

    render() {
        return (
            <section className="section ariadne-section-uniform-padding">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-one-third has-text-left">
                            <div className="card">
                                <div className="card-content">
                                    <p>Choose your route preferences:</p>
                                    <br/>
                                    <PreferencesList auth={this.props.auth} visualizeRoute={this.visualizeRoute}/>
                                    <hr/>
                                    <p>Results:</p>
                                    <br/>
                                    <RoutesList auth={this.props.auth} visualizeRoute={this.visualizeRoute}/>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="card">
                                <div className="card-content is-paddingless">
                                    <MapWithRoutes
                                        auth={this.props.auth}
                                        route={this.state.route}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
