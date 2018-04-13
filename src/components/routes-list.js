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
        this.props.customSubmit(this.state.routes[idx]);
    }

    getRoutes() {
        let returnRoutes = []
        for (let i = 0; i < this.state.routes.length; i++)
        {
            returnRoutes.push(this.state.routes[i].route);
        }
        return returnRoutes;
    }

    render() {
        if (this.state.selected == -1)
        {
            return (
                <div className="routes-list">
                        <div className="ariadne-scrollable card-routes-list">
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
            	</div>
            );
        }
        else
        {
            return (
                <div className="routes-list">
                    <div className="ariadne-scrollable card-routes-list">
                    <p> {this.state.routes[this.state.selected].name}: </p>
                    <br/>
                    <p> Elevation Gain: {this.state.routes[this.state.selected].elevation} ft</p>
                    <p> This will be a concise description of the route. </p>
                    <p> Number of waypoints: {this.state.routes[this.state.selected].route.length}</p>
                    <p> More description of the route. </p>
                    <br/>
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
