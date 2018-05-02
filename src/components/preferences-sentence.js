/**
 * @author Mary Giambrone
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Promise from 'bluebird';


import Auth from '../util/auth';


export default class PreferencesSentence extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
    };

    constructor(props) {
        super(props);

        this.state = this.props.preferencesState.getPrefs();

        this.handleSubmit = this.handleSubmit.bind(this);

        console.log(this.state);

    }

    handleSubmit(event) {
        event.preventDefault();
        console.log("submitting preferences");

        return Promise.resolve().then(() => {
            this.props.preferencesState.setPrefs({...this.state, prefSubmitted: true});
        }).then(() => {
            this.props.history.push('/');
        })

        // The format of the route returned from the API is different from what we use locally, see:
        // https://api.ariadnes-thread.me/#api-v1_Planning-planning_route
        // .then(routeData => routeData.route)
        // .then(geometry => this.props.visualizeRoute({geometry}))
            .catch(error => {
                console.error(error);
                console.error("error from submitting preferences");
                // TODO: Replace with user-friendly warning/modal
                alert(error.message);
            });
    }

    onRadioChange(event) {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value
        })
    }


    onTextChange(event) {
        // TODO: Send text information to backend and make suggestions
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value
        });
    }

    render() {
        console.log(this.state);
        return (
            <div className="container-preferences-selection">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column has-text-centered">
                            <form onSubmit={this.handleSubmit}>
                                <div className="card">
                                    <div className="card-content">
                                        Describe your ideal route in a sentence:
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-content">
                                        <div className="column is-centered">
                                            <div className="field">
                                                <div className="control -is-centered">
                                                    <label className="label">
                                                        Travel Type
                                                    </label>
                                                    <label className="radio">
                                                        <input type="radio"
                                                               className="radio"
                                                               name="routeMode"
                                                               value="bike"
                                                               onChange={this.onRadioChange.bind(this)}
                                                               defaultChecked/>
                                                        Biking
                                                    </label><br/>
                                                    <label className="radio">
                                                        <input type="radio"
                                                               className="radio"
                                                               name="routeMode"
                                                               onChange={this.onRadioChange.bind(this)}
                                                               value="run"/>
                                                        Running
                                                    </label><br/>
                                                    <label className="radio">
                                                        <input type="radio"
                                                               className="radio"
                                                               name="routeMode"
                                                               onChange={this.onRadioChange.bind(this)}
                                                               value="walk"/>
                                                        Walking
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="field">

                                            <div className="column is-centered">
                                                <div className="field">
                                                    <div className="control field is-grouped is-grouped-multiline">
                                                        <label className="label is-normal">
                                                            Start at
                                                        </label>
                                                        <div className="field-body">
                                                            <input
                                                                required="true"
                                                                className="input"
                                                                type="text"
                                                                name="startLoc"
                                                                placeholder={"34.1410, -118.1295 or 1200 E. California Blvd or 91125"}
                                                                onChange={this.onTextChange.bind(this)}/>
                                                        </div>
                                                        <label className="label is-normal">
                                                            , total length
                                                        </label>
                                                        <div className="field has-addons">
                                                            <div className="control">
                                                                <input
                                                                    required="true"
                                                                    className="input"
                                                                    type="text"
                                                                    name="length"
                                                                    placeholder="5"
                                                                    onChange={this.onTextChange.bind(this)}/>
                                                            </div>
                                                        </div>

                                                        <div className="control select">
                                                            <select
                                                                name="unit"
                                                                defaultValue="mi"
                                                                // onChange={this.onTextChange.bind(this)}
                                                            >
                                                                <option value="m"> meters</option>
                                                                <option value="ft"> ft</option>
                                                                <option value="mi"> miles</option>
                                                                <option value="km"> kilometers</option>
                                                            </select>
                                                        </div>
                                                        <label className="label is-normal">
                                                            ,
                                                        </label>
                                                    </div>
                                                    <div className="control field is-grouped is-grouped-multiline">
                                                        <label className="label is-normal">
                                                            end at
                                                        </label>
                                                        <div className="field-body">

                                                            <input
                                                                required="true"
                                                                type="text"
                                                                className="input"
                                                                name="endLoc"
                                                                placeholder="coffee shop in 91125"
                                                                onChange={this.onTextChange.bind(this)}/>
                                                        </div>
                                                        <label className="label is-normal">
                                                            .
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="field is-grouped is-grouped-multiline">
                                            <label className="label is-normal">
                                                (Optional) Visit
                                            </label>
                                            <div className="field-body">
                                                <input
                                                    type="text"
                                                    className="input"
                                                    name="pointsOfInterest"
                                                    placeholder="some parks"
                                                    onChange={this.onTextChange.bind(this)}/>
                                            </div>
                                            <label className="label is-normal">
                                                on the way, prefer
                                            </label>
                                            <div className="field-body">
                                                <input
                                                    type="text"
                                                    className="input"
                                                    name="pathtype"
                                                    placeholder="green"
                                                    onChange={this.onTextChange.bind(this)}/>
                                            </div>
                                            <label className="label is-normal">
                                                paths.
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-content">
                                        <button className="button is-primary">Find my route!</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
