/**
 * @author Mary Giambrone
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Promise from 'bluebird';

import Auth from '../util/auth';

const EXAMPLE_ROUTE_JSON_WITH_INFO = [
{
    "name": "Route1", 
    "route": [
    [34.14093, -118.129366],
    [34.140947, -118.12801],
    [34.140388, -118.128002],
    [34.139434, -118.122862]
    ],
    "elevation": "1500"
},
{
    "name": "Route2", 
    "route": [
    [35.14093, -118.129366],
    [35.140947, -118.12801],
    [35.140388, -118.128002],
    [35.139434, -118.122862]
    ],
    "elevation": "2700"
}
  ];

export default class RoutesList extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {selected: -1, routes: EXAMPLE_ROUTE_JSON_WITH_INFO};
    }

    handleChange(idx, event) {
        event.preventDefault();
        this.setState({selected: idx});
        // TODO: Communicate the chosen route back to the route_visualizer
        // Promise.resolve()
        //     .then(() => JSON.parse(this.state.routes[idx]).route)
        //     .then(route => this.setState({route}))
        //     .catch(error => {
        //         console.error(error);
        //         // TODO: Replace with user-friendly warning/modal
        //         alert('Error occurred during form submission. Check console.');
        //     });
    }

    render() {
        if (this.state.selected == -1)
        {
            return (
                <div className="routes-list">
                        {
                            this.state.routes.map((route, idx) => {
                                return (<div key={'route-input'+idx}>
                                 <button className="button is-info" onClick={this.handleChange.bind(this, idx)}> 
                                 {route["name"]} 
                                 </button>
                                 <hr/>
                                </div>);
                            })
                        }
            	</div>
            );
        }
        else
        {
            return (
                <div className="routes-list">
                    <p> {this.state.routes[this.state.selected].name}: </p>
                    <br/>
                    <p> Elevation Gain: {this.state.routes[this.state.selected].elevation} ft</p>
                    <br/>
                    <button className="button is-info" onClick={this.handleChange.bind(this, -1)}> 
                    Back to Results List 
                    </button>

                </div>
            ); 
        }
    }
}
