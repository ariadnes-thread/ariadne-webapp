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
                                        <p><b>Travel Type</b></p>
                                        <p>Biking or Running?</p>
                                        <div className="column is-centered">
                                            <input type="radio"
                                                   name="BikeOrRun"
                                                   value="bike"
                                                   onChange={this.onRadioChange.bind(this)}
                                                   defaultChecked/>Biking<br/>
                                            <input type="radio"
                                                   name="BikeOrRun"
                                                   onChange={this.onRadioChange.bind(this)}
                                                   value="run"/>Running<br/>
                                            <input type="radio"
                                                   name="BikeOrRun"
                                                   onChange={this.onRadioChange.bind(this)}
                                                   value="walk"/>Walking<br/>
                                        </div>
                                        <div className="column is-centered">
                                            Start at
                                            <input
                                                type="text"
                                                name="startLoc"
                                                defaultValue={"34.1410, -118.1295"}
                                                onChange={this.onTextChange.bind(this)}/>
                                            , total length
                                            <input
                                                type="text"
                                                name="length"
                                                defaultValue={"20 mi"}
                                                onChange={this.onTextChange.bind(this)}/>
                                            , end at
                                            <input
                                                type="text"
                                                name="endLoc"
                                                defaultValue={"coffee shop in 91125"}
                                                onChange={this.onTextChange.bind(this)}/>

                                        </div>
                                        <div className="column is-centered">
                                            (Optional) Visit
                                            <input
                                                type="text"
                                                name="pois"
                                                defaultValue={"some parks"}
                                                onChange={this.onTextChange.bind(this)}/>
                                            on the way, prefer
                                            <input
                                                type="text"
                                                name="pathtype"
                                                defaultValue={"green"}
                                                onChange={this.onTextChange.bind(this)}/>
                                            paths.
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-content">
                                        <button className="button">Find my route!</button>
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
