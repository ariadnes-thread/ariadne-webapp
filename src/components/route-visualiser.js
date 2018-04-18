/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @author Mary Giambrone
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Promise from 'bluebird';

import MapWithRoutes from './map-with-routes';
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
            geometry: null,
        };

        this.visualizeRoute = this.visualizeRoute.bind(this);
        this.selectedZip = 0;
    }


    visualizeRoute(routeData) {
        return Promise.resolve()
            .then(() => {
                if (!routeData) return {route: this.refs.routesList.getRoutes()};
                if (routeData.geometry) return {geometry: routeData.geometry, route: null};
                if (routeData.route) return {geometry: null, route: [routeData.route]};
            })
            .then(stateUpdate => this.setState(stateUpdate))
    }

    setZip(zip, myobj)
    {
        myobj.refs.preferencesList.updateZipPref(zip);
    }

    handleMapClick(callback, eventData) {
        /* eslint-disable no-undef */
        const geocoder = new google.maps.Geocoder;
        /* eslint-enable no-undef */
        const zipret = geocoder.geocode({'location' : {lat: eventData.latLng.lat(), lng: eventData.latLng.lng()}}, function(results, status)
            {
                if (status == 'OK')
                {
                    if (results[0])
                    {
                        for (let i = 0; i < results[0].address_components.length; i++)
                        {
                            if (results[0].address_components[i].types[0] == "postal_code")
                            {
                                let zip = results[0].address_components[i].short_name;
                                callback.setZip(zip, callback);
                            }

                        }
                    }
                }
            });
    }

    render() {
        return (
            <section className="section ariadne-section-uniform-padding">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-one-third has-text-left">
                            <div className="card">
                                <div className="card-content card-ariadne-lists">
                                    <div className="preferences-list">
                                    <p>Choose your route preferences:</p>
                                    <br/>
                                    <PreferencesList
                                        auth={this.props.auth}
                                        ref="preferencesList"
                                        visualizeRoute={this.visualizeRoute}
                                        selectedPoint={this.state.selectedZip}
                                        />
                                    </div>
                                    <hr/>
                                    <div className="container-routes-list">
                                    <p>Results List:</p>
                                    <br/>
                                    <RoutesList 
                                        auth={this.props.auth} 
                                        ref="routesList" 
                                        visualizeRoute={this.visualizeRoute}
                                    />
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="column">
                            <div className="card">
                                <div className="card-content is-paddingless">
                                    <MapWithRoutes
                                        auth={this.props.auth}
                                        route={this.state.route}
                                        handleClick={this.handleMapClick}
                                        parent={this}
                                        geometry={this.state.geometry}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
