/**
 * @author Mary Giambrone
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import Icon from '@fortawesome/react-fontawesome';
import {withScriptjs, withGoogleMap, Polyline, Polygon, InfoWindow, Marker, GoogleMap, DirectionsRenderer} from 'react-google-maps';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Promise from 'bluebird';

import Auth from '../util/auth';


const defaultPreferences = {"startZip":["write in!", "text"],
                            "endZip":["write in!", "text"],
                            "search radius": ["1", "range"],
                            "greenery": ["50", "range"],
                            "elevation": ["20", "range"],
                            "distance": ["30", "range"],
                            "cofeeshops": ["2", "range"],
                            "time": ["60", "range"],
                            "origin": ["Origin PoI", "text"],
                            "destination": ["Destination PoI", "text"]};
const MyMapComponent = withScriptjs(withGoogleMap(props => {
    // No geometry, try to render the route using directions.
        return <GoogleMap 
            // ref={(map) => {
            //      if(map && props.bounds) {
            //         map.fitBounds(props.bounds);
            //         console.log(props.bounds);
            //         console.log(props.bounds.getCenter().lat() + ", " + props.bounds.getCenter().lng());
            //         map.panTo(props.bounds.getCenter());
            //     }}}
            // center={props.bounds ? props.bounds.getCenter() : props.defaultCenter}
            // onClick={(eventData) =>{props.clickHandle(props.callbackClick, eventData);}}
            // defaultZoom={props.defaultZoom} 
            // defaultCenter={props.defaultCenter}
        >
            {props.directions && props.directions.map((direction, idx) => {
                return (
                    <div key={'direction-input'+idx}>
                                    <DirectionsRenderer directions={direction}/>
                    </div>
                );
            })}
        </GoogleMap>;

}));

export default class PreferencesSelection extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {preferences: defaultPreferences,
                        pointsOfInterest: null,
                        selectedInput: -1};

        // TO DO: drag and drop ordering of preferences

        this.handleSubmit = this.handleSubmit.bind(this);

        console.log(this.props.auth.getGoogleApiUrl());

    }

    componentDidMount() {
        Promise.resolve()
            .then(() => this.props.auth.api.planningModule.fetchPointsOfInterest())
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

    handleChange(fieldName, fieldType, event) {
        // console.log(fieldName);
        // console.log(fieldType);
        console.log(event);
        let value = event.target.value;
        // if (['origin', 'destination'].includes(fieldName)) {
        //     value = this.state.pointsOfInterest[value];
        //     console.log(value);
        // }
        this.setState({
            preferences: {
                ...this.state.preferences,
                [fieldName]: [value, fieldType],
            },
        });
    }

    handleSelectZip(index, event) {
        event.preventDefault();
        this.setState({selectedInput: index});
    }

    updateZipPref(zip) {
        if (this.state.selectedInput === 0)
        {        
            this.setState({
                preferences: {
                    ...this.state.preferences,
                    "startZip": [zip, "text"],
                },
            });
        }
        else if (this.state.selectedInput === 1)
        {
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
        
        return Promise.resolve()
            .then(() => {
                let retpref = {};

                Object.keys(this.state.preferences).map((preference) => {
                    if (preference === "origin" || preference === "destination")
                        retpref[preference] = this.state.pointsOfInterest[this.state.preferences[preference][0]];
                    else
                        retpref[preference] = this.state.preferences[preference][0];
                });
                return retpref;

            }).then((retpref) => {
                return this.props.auth.api.planningModule.planRoute({constraints: retpref});
            })

            // The format of the route returned from the API is different from what we use locally, see:
            // https://api.ariadnes-thread.me/#api-v1_Planning-planning_route
            .then(routeData => routeData.route)
            .then(geometry => this.props.visualizeRoute({geometry}))
            .catch(error => {
                console.error(error);
                console.error("error from submitting preferences");
                // TODO: Replace with user-friendly warning/modal
                alert(error.message);
            });
    }

    renderPointsOfInterestSelect() {
        const pointsOfInterest = this.state.pointsOfInterest;
        if (!pointsOfInterest) {
            // TODO: Add an indicator for failed loading
            return <option disabled>Loading...</option>;
        }

        const optionsComponents = new Array(pointsOfInterest.length);
        for (let i = 0; i < pointsOfInterest.length; i++) {
            const point = pointsOfInterest[i];
            optionsComponents[i] = <option key={`poi-${i}`} value={i}>{point.name}</option>;
        }
        return optionsComponents;
    }

    renderStartEndSelect() {
        const options = ["Park", "Bus Stop", "Monument", "Mall", "Restaurant"];
        const optionsComponents = new Array(options.length);
        for (let i = 0; i < options.length; i++) {
            const opt = options[i];
            optionsComponents[i] = <option key={`opt-${i}`} value={i}>{opt}</option>;
        }
        return optionsComponents;
    }

    render() {
        return (
            <div className="container-preferences-selection">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column has-text-centered">
                        <form>
                            <div className="card">
                                <div className="card-content">
                                    Select all of your preferences here!
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-content">
                                    <p><b>1. Choose your Location and Search Radius</b></p>
                                    <p>Navigate on the map to the area where you want to find routes.</p>
                                    <MyMapComponent
                                        googleMapURL={this.props.auth.getGoogleApiUrl()}
                                        loadingElement={<div style={{height: `100%`}}/>}
                                        containerElement={<div style={{height: `75vh`}}/>}
                                        mapElement={<div style={{height: `100%`}}/>}
                                    />
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-content">
                                    <p><b>2. Route Details</b></p>
                                    <p>Biking or Running?</p>
                                    <p>(insert nice drawings here)</p>
                                    <div className="columns is-centered">
                                        <div className="column">
                                            <input type="radio" name="BikeOrRun" value="bike" defaultChecked/><br/>Biking
                                        </div>
                                        <div className="column">
                                            <input type="radio" name="BikeOrRun" value="run"/><br/>Running
                                        </div>
                                    </div>                                    
                                    <p>Loop or Point-to-Point?</p>
                                    <p>(insert nice drawings here)</p>
                                    <div className="columns is-centered">
                                        <div className="column">
                                            <input type="radio" name="LoopOrP2P" value="loop" defaultChecked/><br/>Loop
                                        </div>
                                        <div className="column">
                                            <input type="radio" name="LoopOrP2P" value="p2p"/><br/>Point-To-Point
                                        </div>
                                    </div>
                                    <p>Length Constraints:</p>
                                    <p>(insert nice drawings here)</p>
                                    <div className="columns is-centered">
                                        <div className="column is-one-quarter has-text-right">
                                            <div className="column has-text-left">
                                                <input type="checkbox" name="distance" value="Length" required="true" defaultChecked/>
                                                Distance (miles):<br/>
                                                <input type="checkbox" name="distance" value="Time" required="true"/>
                                                Time (minutes):<br/>
                                            </div>
                                        </div>
                                        <div className="column is-one-third has-text-left">
                                            <div className="column has-text-left">
                                                <input type="text"/> to <input type="text"/><br/>
                                                <input type="text"/> to <input type="text"/><br/>
                                            </div>
                                        </div>
                                    </div>
                                    <p>Start & End Points:</p>
                                    <div className="columns is-centered">
                                        <div className="column">Starting Location:
                                            <div className="columns is-centered">
                                                <div className="column">
                                                    <input type="radio" name="startPoints" value="specific" defaultChecked/><br/>Specific Location(s)
                                                </div>
                                                <div className="column">
                                                    <input type="radio" name="startPoints" value="type"/><br/>Type of Location in an area
                                                    <br/><select> {this.renderStartEndSelect()}</select>
                                                </div>              
                                            </div>
                                            <MyMapComponent
                                                googleMapURL={this.props.auth.getGoogleApiUrl()}
                                                loadingElement={<div style={{height: `100%`}}/>}
                                                containerElement={<div style={{height: `75vh`}}/>}
                                                mapElement={<div style={{height: `100%`}}/>}
                                            />
                                        </div>
                                        <div className="column" style={{display: (this.state.loop) ? "none" : ""}}>Ending Location:
                                            <div className="columns is-centered">
                                                <div className="column">
                                                    <input type="radio" name="endPoints" value="specific" defaultChecked/><br/>Specific Location(s)
                                                </div>
                                                <div className="column">
                                                    <input type="radio" name="endPoints" value="type"/><br/>Type of Location in an area
                                                    <br/><select> {this.renderStartEndSelect()}</select>
                                                </div>              
                                            </div>
                                            <MyMapComponent
                                                googleMapURL={this.props.auth.getGoogleApiUrl()}
                                                loadingElement={<div style={{height: `100%`}}/>}
                                                containerElement={<div style={{height: `75vh`}}/>}
                                                mapElement={<div style={{height: `100%`}}/>}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-content">
                                    <p><b>3. Route Preferences</b></p>
                                    Elevation Gain (ft): <input type="text"/> to <input type="text"/><br/><br/>
                                    Setting: <input type="radio" name="setting" value="Urban" defaultChecked/>Urban
                                    <input type="radio" name="setting" value="Urban"/>Rural
                                    <input type="radio" name="setting" value="Urban"/>Suburban<br/>
                                    <br/><p>I would like to visit:</p>
                                    <div className="columns is-centered">
                                        <div className="column is-one-quarter has-text-left">
                                        <input type="checkbox" name="node" value="park"/> Parks<br/>
                                        <input type="checkbox" name="node" value="coffee"/> Coffeeshops<br/>
                                        <input type="checkbox" name="node" value="landmark"/> Landmarks<br/>
                                        <input type="checkbox" name="node" value="restaurant"/> Restaurants<br/>
                                        </div>
                                    </div>
                                    <p>I would like to travel on:</p>
                                    <div className="columns is-centered">
                                        <div className="column is-one-quarter has-text-left">
                                        <input type="checkbox" name="edge" value="bikepath"/> Bike Paths<br/>
                                        <input type="checkbox" name="edge" value="green"/> Green Space<br/>
                                        <input type="checkbox" name="edge" value="paved"/> Paved Roads<br/>
                                        </div>
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
                    d
                </div>
            </div>
        );
    }
}
