/**
 * @author Mary Giambrone
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Promise from 'bluebird';

import Auth from '../util/auth';


export default class PreferencesList extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
        visualizeRoute: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {};

        // TO DO: drag and drop ordering of preferences
        this.preferences = ['greenery', 'elevation', 'distance'];
        this.defaultValues = ['50', '20', '30'];

        for (let i = 0; i < this.preferences.length; i++) {
            this.state[this.preferences[i]] = this.defaultValues[i];
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(idx, event) {
        event.preventDefault();
        this.setState({[idx]: event.target.value});
    }


    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state);

        return Promise.resolve()
            .then(() => this.props.auth.api.planningModule.planRoute({constraints: this.state}))
            .then(route => {
                // The format of the route returned from the API is different from what we use locally, see:
                // https://api.ariadnes-thread.me/#api-v1_Planning-planning_route

                // Convert API route format into webapp format:
                const newRoute = [];
                for (const point of route) {
                    newRoute.push([point.latitude, point.longitude]);
                }
                return newRoute;
            })
            .then(route => this.props.visualizeRoute({route}))

            // TODO: Replace this with a nice error modal.
            .catch(error => {
                console.error(error);
                // TODO: Replace with user-friendly warning/modal
                alert(error.message);
            });
    }

    render() {
        return (
            <div className="preferences-list">
                <form onSubmit={this.handleSubmit}>
                    {
                        this.preferences.map((preference, idx) => {
                            return (<div key={'preference-input' + idx}>
                                {preference}:
                                {this.state[preference] ? this.state[preference] : this.defaultValues[idx]}
                                <input type="range" defaultValue={this.defaultValues[idx]}
                                       onChange={this.handleChange.bind(this, preference)}/>
                            </div>);
                        })
                    }
                    <br/>
                    <button className="button is-info">Update route</button>
                </form>
            </div>
        );
    }
}
