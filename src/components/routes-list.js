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
        name: 'Caltech #1',
        route: [
            [34.14093, -118.129366],
            [34.140947, -118.12801],
            [34.140388, -118.128002],
            [34.139434, -118.122862],
        ],
        elevation: '1500',
    },
    {
        name: 'Caltech #2',
        route: [
            [34.137234, -118.127962],
            [34.136871, -118.125630],
            [34.137543, -118.123713],
        ],
        elevation: '1500',
    },
    {
        name: 'Route2',
        route: [
            [35.14093, -118.129366],
            [35.140947, -118.12801],
            [35.140388, -118.128002],
            [35.139434, -118.122862],
        ],
        elevation: '2700',
    },
];

export default class RoutesList extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
        customSubmit: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {selected: -1, routes: EXAMPLE_ROUTE_JSON_WITH_INFO};
    }

    handleChange(idx, event) {
        event.preventDefault();
        this.setState({selected: idx});
        console.log(this.props.customSubmit);
        console.log(this.state.routes[idx]);
        return this.props.customSubmit(this.state.routes[idx]);
    }

    renderRouteList() {
        const routeListComponents = new Array(this.state.routes.length);
        for (let i = 0; i < this.state.routes.length; i++) {
            const route = this.state.routes[i];
            const activeClass = i === this.state.selected ? ' has-text-red' : '';
            routeListComponents[i] = (
                <div>
                    {i !== 0 && <br/>}
                    <a key={`route-input-${i}`} onClick={this.handleChange.bind(this, i)}>
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
                                            <small><a>Choose this route</a></small>
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
        return (
            <div>{this.renderRouteList()}</div>
        );
    }
}
