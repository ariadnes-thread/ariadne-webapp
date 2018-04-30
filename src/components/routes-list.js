/**
 * @author Mary Giambrone
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Auth from '../util/auth';

const EXAMPLE_ROUTE_JSON_WITH_INFO = [
    {
        "name": "Avery to Catalina",
        "route": [
            [34.14093, -118.129366],
            [34.140947, -118.12801],
            [34.140388, -118.128002],
            [34.139434, -118.122862]
        ],
        "elevation": "1500"
    },
    {
        "name": "Avery to Colorado",
        "route": [
            [34.139434, -118.122862],
            [34.141804, -118.121323],
            [34.144651, -118.121418],
            [34.145987, -118.117835]
        ],
        "elevation": "2700"
    },
    {
        "name": "Avery to Gym",
        "route": [
            [34.140478, -118.122876],
            [34.134290, -118.125798]
        ],
        "elevation": "100"
    }
];
export default class RoutesList extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
        visualizeRoute: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {selected: -1, routes: EXAMPLE_ROUTE_JSON_WITH_INFO};
    }

    handleChange(idx, event) {
        event.preventDefault();
        console.log("index is " + idx);
        return Promise.resolve()
            .then(() => this.props.visualizeRoute(this.state.routes[idx]))
            .then(() => this.setState({selected: idx}))
            .catch(error => {
                console.error(error);
                // TODO: Replace with user-friendly warning/modal
                alert('Error occurred during route visualization. Check console.');
            });
    }

    getRoutes() {
        let returnRoutes = []
        for (let i = 0; i < this.state.routes.length; i++)
        {
            returnRoutes.push(this.state.routes[i].route);
        }
        return returnRoutes;
    }

    renderRouteList() {
        const routeListComponents = new Array(this.state.routes.length);
        for (let i = 0; i < this.state.routes.length; i++) {
            const route = this.state.routes[i];
            const activeClass = i === this.state.selected ? ' has-text-danger' : '';
            routeListComponents[i] = (
                <div key={`route-input-${i}`}>
                    {i !== 0 && <br/>}
                    <a onClick={this.handleChange.bind(this, i)}>
                        <div className="box">
                            <article className="media">
                                <div className="media-content">
                                    <div className="content">
                                        <p>
                                            <strong>
                                                <span className="has-text-grey">Route:&nbsp;</span>
                                                <span className={activeClass}>{route.name}</span>
                                            </strong>
                                            <br/>
                                            <small>Elevation: {route.elevation} ft ({route.route.length} points)</small>
                                            <br/>
                                            <small><span className="is-link">Choose this route</span></small>
                                        </p>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </a>
                </div>
            );
        }
        return routeListComponents;
    }

    render() {
        if (this.state.selected === -1) {
            return (
                <div className="ariadne-scrollable routes-list">
                    <div className="ariadne-scroll-card">
                        {this.renderRouteList()}
                    </div>
                </div>
            );
        }
        else
        {
            return (
                <div className="routes-list">
                    <p> {this.state.routes[this.state.selected].name}: </p>
                    <div className="ariadne-scrollable card-routes-list">
                        <div className="ariadne-scroll-card">
                            <p> Elevation Gain: {this.state.routes[this.state.selected].elevation} ft</p>
                            <p> This will be a concise description of the route. </p>
                            <p> Number of waypoints: {this.state.routes[this.state.selected].route.length}</p>
                            <p> More description of the route. </p>
                            <p> More description of the route. (Testing scroll functionality) </p>
                            <p> More description of the route. </p>
                            <p> More description of the route. </p>
                            <p> More description of the route. (Testing scroll functionality) </p>
                            <p> More description of the route. (Testing scroll functionality) </p>
                            <br/>
                        </div>
                    </div>
                    <div className="ariadne-button-no-scroll">
                        <button className="button is-info" onClick={this.handleChange.bind(this, -1)}>
                            Back to Results List
                        </button>
                    </div>

                </div>
            );
        }
    }
}
