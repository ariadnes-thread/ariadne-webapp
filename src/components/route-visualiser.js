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

        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleSubmit(event) {
        event.preventDefault();
        Promise.resolve()
            .then(() => JSON.parse(this.state.jsonInput).route)
            .then(route => this.setState({route}))
            .catch(error => {
                console.error(error);
                // TODO: Replace with user-friendly warning/modal
                alert('Error occurred during form submission. Check console.');
            });
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
                                    <PreferencesList auth={this.props.auth}/>
                                    <hr/>
                                    <p>Results List: {this.state.greenery}</p>
                                    <br/>
                                    <RoutesList auth={this.props.auth}/>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="card">
                                <div className="card-content ariadne-no-padding">
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
