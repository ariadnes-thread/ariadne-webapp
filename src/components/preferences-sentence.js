/**
 * @author Mary Giambrone
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import Icon from '@fortawesome/react-fontawesome';
import {
    withScriptjs,
    withGoogleMap,
    Polyline,
    Polygon,
    InfoWindow,
    Marker,
    GoogleMap,
    DirectionsRenderer
} from 'react-google-maps';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Promise from 'bluebird';
import {compose, lifecycle} from 'recompose';
import {Switch, Route, Redirect} from 'react-router-dom';


import Auth from '../util/auth';


const defaultState = {
    overallZoom: 16,
    overallCenter: {lat: 34.138932, lng: -118.125339},
    BikeOrRun: "bike",
    LoopOrP2P: "loop",
    distance: [true, 0, 10],
    time: [false, 0, 60],
    start: "location",
    end: "location",
    startLoc: {lat: 34.138932, lng: -118.125339},
    endLoc: {lat: 34.138932, lng: -118.125339},
    elevation: [true, 0, 1000],
    setting: "urban",
    node: [],
    edge: []
};


export default class PreferencesSentence extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
    };

    constructor(props) {
        super(props);

        this.state = defaultState;

        // this.state = {preferences: defaultPreferences,
        //                 pointsOfInterest: null,
        //                 selectedInput: -1};

        // TO DO: drag and drop ordering of preferences

        this.handleSubmit = this.handleSubmit.bind(this);

        console.log(this.state);

    }

    componentDidMount() {
        Promise.resolve()
        // .then(() => this.props.auth.api.planningModule.fetchPointsOfInterest())
            .then(pointsOfInterest => {
                this.setState({
                    pointsOfInterest,
                    preferences: {
                        ...this.state.preferences,
                        origin: [0, "text"],
                        destination: [0, "text"],
                    },
                });
            })
            .catch(error => {
                console.error(error);
                console.error(JSON.stringify(error));
                // TODO: Replace this with a nice modal popup
                // If not logged in, there will be a different error that prevents anything from happening.
                // if (this.props.auth.isAuthenticated())
                //  alert('Error occurred while fetching points of interest. Check console.');
            });
    }

    handleSelectZip(index, event) {
        event.preventDefault();
        this.setState({selectedInput: index});
    }

    updateZipPref(zip) {
        if (this.state.selectedInput === 0) {
            this.setState({
                preferences: {
                    ...this.state.preferences,
                    "startZip": [zip, "text"],
                },
            });
        }
        else if (this.state.selectedInput === 1) {
            this.setState({
                preferences: {
                    ...this.state.preferences,
                    "endZip": [zip, "text"],
                },
            });
        }

    }


    handleSubmit(event) {
        event.preventDefault();
        console.log("submitting preferencecs");

        return Promise.resolve()
            .then(() => {
                return this.state;
                // let retpref = {};

                // Object.keys(this.state).map((preference) => {
                //     // if (preference === "origin" || preference === "destination")
                //     //     retpref[preference] = this.state.pointsOfInterest[this.state.preferences[preference][0]];
                //     // else
                //         retpref[preference] = this.state[preference];
                // });
                // return retpref;

            }).then((retpref) => {
                console.log("redirecting");
                this.props.history.push('/route');
                // window.location = '/route';
                // return this.props.auth.api.planningModule.planRoute({constraints: retpref});
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
