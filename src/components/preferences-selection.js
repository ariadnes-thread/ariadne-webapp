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


// const defaultPreferences = {"startZip":["write in!", "text"],
//                             "endZip":["write in!", "text"],
//                             "search radius": ["1", "range"],
//                             "greenery": ["50", "range"],
//                             "elevation": ["20", "range"],
//                             "distance": ["30", "range"],
//                             "cofeeshops": ["2", "range"],
//                             "time": ["60", "range"],
//                             "origin": ["Origin PoI", "text"],
//                             "destination": ["Destination PoI", "text"]};

const defaultState = {overallZoom: 16,
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

const MapComponentLocationRadius = withScriptjs(withGoogleMap(props => {
        return <GoogleMap 
            ref={(locationRadiusMap) => {
                // console.log(locationRadiusMap);
                // console.log(locationRadiusMap.getBounds());
                return locationRadiusMap;
            }}
            // ref={(map) => {
            //      if(map && props.bounds) {
            //         map.fitBounds(props.bounds);
            //         console.log(props.bounds);
            //         console.log(props.bounds.getCenter().lat() + ", " + props.bounds.getCenter().lng());
            //         map.panTo(props.bounds.getCenter());
            //     }}}
            // center={props.bounds ? props.bounds.getCenter() : props.defaultCenter}
            // onClick={(eventData) =>{props.clickHandle(props.callbackClick, eventData);}}
            defaultZoom={props.defaultZoom} 
            defaultCenter={props.defaultCenter}
            onBoundsChanged={props.boundsChange.bind(this, props.parent)}
            
            // {() => {
            //     console.log(this);
            //     console.log(props);
            //     // console.log(locationRadiusMap);
            // // console.log(this.refs);
            // // console.log(this.refs.locationRadiusMap);
            // // console.log(this);
            // props.boundsChange}}//{(event)=> {console.log(event);console.log(map.getBounds());}}
        >
        </GoogleMap>;

}));

const MapComponentStartEnd = withScriptjs(withGoogleMap(props => {
        return <GoogleMap 
            ref={(locationStartEnd) => {
                // console.log(locationRadiusMap);
                // console.log(locationRadiusMap.getBounds());
                return locationStartEnd;
            }}
            // ref={(map) => {
            //      if(map && props.bounds) {
            //         map.fitBounds(props.bounds);
            //         console.log(props.bounds);
            //         console.log(props.bounds.getCenter().lat() + ", " + props.bounds.getCenter().lng());
            //         map.panTo(props.bounds.getCenter());
            //     }}}
            // center={props.bounds ? props.bounds.getCenter() : props.defaultCenter}
            // onClick={(eventData) =>{props.clickHandle(props.callbackClick, eventData);}}
            defaultZoom={props.defaultZoom} 
            defaultCenter={props.defaultCenter}
            onBoundsChanged=
                {console.log(props)}//this.props.boundsChange.bind(this, props.parent)}
            
            // {() => {
            //     console.log(this);
            //     console.log(props);
            //     // console.log(locationRadiusMap);
            // // console.log(this.refs);
            // // console.log(this.refs.locationRadiusMap);
            // // console.log(this);
            // props.boundsChange}}//{(event)=> {console.log(event);console.log(map.getBounds());}}
        >
        </GoogleMap>;

}));

export default class PreferencesSelection extends Component {

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
                window.location = '/route';
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

    onBoundsChangedLocationRadius(parent, event) {
        console.log("onBoundsChangedLocationRadius");
        console.log(this);
        console.log(parent);
        console.log(event);
        // console.log(event.getBounds());
        console.log(parent.refs);
        console.log(parent.refs.MyMapComponent);
        // console.log(parent.refs.MyMapComponent.getBounds());
    }

    onRadioChange(event) {
        this.setState({...this.state,
            [event.target.name]: event.target.value})
    }

    onCheckboxChange(event) {
        this.setState({...this.state,
            [event.target.value]: [event.target.checked, this.state[event.target.value][1], this.state[event.target.value][2]]})
    }

    onCheckboxListChange(event) {
        let prev_list = this.state[event.target.name];
        if (event.target.checked && !prev_list.includes(event.target.value))
        {
            prev_list.push(event.target.value)
            this.setState({...this.state,
                [event.target.name]: prev_list});
        }
        else if (!event.target.checked && prev_list.includes(event.target.value))
        {
            const index = prev_list.indexOf(event.target.value);
            prev_list.splice(index, 1);
            this.setState({...this.state,
                [event.target.name]: prev_list});
        }          
    }

    onTextChange(event) {
        const prop_name = event.target.name.split("_");
        if (prop_name[1] === "min")
        {
            this.setState({...this.state, 
                [prop_name[0]]: [this.state[prop_name[0]][0], event.target.value, this.state[prop_name[0]][2]]})
        }
        else if (prop_name[1] === "max")
        {
            this.setState({...this.state, 
                [prop_name[0]]: [this.state[prop_name[0]][0], this.state[prop_name[0]][1], event.target.value]})
        }
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
        console.log(this.state);
        return (
            <div className="container-preferences-selection">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column has-text-centered">
                        <form onSubmit={this.handleSubmit}>
                            <div className="card">
                                <div className="card-content">
                                    Select all of your preferences here!
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-content">
                                    <p><b>1. Choose your Location and Search Radius</b></p>
                                    <p>Navigate on the map to the area where you want to find routes.</p>
                                    <MapComponentLocationRadius
                                        ref="MyMapComponentLocationRadius"
                                        googleMapURL={this.props.auth.getGoogleApiUrl()}
                                        loadingElement={<div style={{height: `100%`}}/>}
                                        containerElement={<div style={{height: `75vh`}}/>}
                                        mapElement={<div style={{height: `100%`}}/>}
                                        defaultCenter={this.state.overallCenter}
                                        defaultZoom={this.state.overallZoom}
                                        parent={this}
                                        boundsChange={this.onBoundsChangedLocationRadius}
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
                                            <input type="radio" 
                                            name="BikeOrRun" 
                                            value="bike" 
                                            onChange={this.onRadioChange.bind(this)}
                                            defaultChecked/><br/>Biking
                                        </div>
                                        <div className="column">
                                            <input type="radio" 
                                            name="BikeOrRun" 
                                            onChange={this.onRadioChange.bind(this)}
                                            value="run"/><br/>Running
                                        </div>
                                    </div>                                    
                                    <p>Loop or Point-to-Point?</p>
                                    <p>(insert nice drawings here)</p>
                                    <div className="columns is-centered">
                                        <div className="column">
                                            <input type="radio" 
                                            name="LoopOrP2P" 
                                            value="loop" 
                                            onChange={this.onRadioChange.bind(this)}
                                            defaultChecked/><br/>Loop
                                        </div>
                                        <div className="column">
                                            <input type="radio" 
                                            name="LoopOrP2P" 
                                            onChange={this.onRadioChange.bind(this)}
                                            value="p2p"/><br/>Point-To-Point
                                        </div>
                                    </div>
                                    <p>Length Constraints:</p>
                                    <p>(insert nice drawings here)</p>
                                    <div className="columns is-centered">
                                        <div className="column is-one-quarter has-text-right">
                                            <div className="column has-text-left">
                                                <input type="checkbox" 
                                                    name="length" 
                                                    value="distance" 
                                                    required={!this.state.time[0]}
                                                    onChange={this.onCheckboxChange.bind(this)}
                                                defaultChecked/>
                                                Distance (miles):<br/>
                                                <input 
                                                    type="checkbox" 
                                                    name="length" 
                                                    value="time" 
                                                    onChange={this.onCheckboxChange.bind(this)}
                                                required={!this.state.distance[0]}/>
                                                Time (minutes):<br/>
                                            </div>
                                        </div>
                                        <div className="column is-one-third has-text-left">
                                            <div className="column has-text-left">
                                                <input 
                                                    type="text" 
                                                    name="distance_min" 
                                                    defaultValue={this.state["distance"][1]}
                                                    onChange={this.onTextChange.bind(this)}/> 
                                                to 
                                                <input 
                                                    type="text" 
                                                    name="distance_max" 
                                                    defaultValue={this.state["distance"][2]}
                                                    onChange={this.onTextChange.bind(this)}/><br/>
                                                <input 
                                                    type="text" 
                                                    name="time_min" 
                                                    defaultValue={this.state["time"][1]}
                                                    onChange={this.onTextChange.bind(this)}/> 
                                                to 
                                                <input 
                                                    type="text" 
                                                    name="time_max" 
                                                    defaultValue={this.state["time"][2]}
                                                    onChange={this.onTextChange.bind(this)}/><br/>
                                            </div>
                                        </div>
                                    </div>
                                    <p>Start & End Points:</p>
                                    <div className="columns is-centered">
                                        <div className="column">Starting Location:
                                            <div className="columns is-centered">
                                                <div className="column">
                                                    <input 
                                                        type="radio" 
                                                        name="startPoints" 
                                                        value="specific" 
                                                        defaultChecked/><br/>Specific Location(s)
                                                </div>
                                                <div className="column">
                                                    <input 
                                                        type="radio" 
                                                        name="startPoints" 
                                                        value="type"/><br/>Type of Location in an area
                                                    <br/><select> {this.renderStartEndSelect()}</select>
                                                </div>              
                                            </div>
                                            <MapComponentStartEnd
                                                googleMapURL={this.props.auth.getGoogleApiUrl()}
                                                loadingElement={<div style={{height: `100%`}}/>}
                                                containerElement={<div style={{height: `75vh`}}/>}
                                                mapElement={<div style={{height: `100%`}}/>}
                                                defaultCenter={this.state.overallCenter}
                                                defaultZoom={this.state.overallZoom}
                                            />
                                        </div>
                                        <div className="column" style={{display: (this.state.loop) ? "none" : ""}}>Ending Location:
                                            <div className="columns is-centered">
                                                <div className="column">
                                                    <input type="radio" 
                                                        name="endPoints" 
                                                        value="specific" 
                                                        defaultChecked/><br/>Specific Location(s)
                                                </div>
                                                <div className="column">
                                                    <input type="radio" 
                                                        name="endPoints" 
                                                        value="type"/><br/>Type of Location in an area
                                                    <br/><select> {this.renderStartEndSelect()}</select>
                                                </div>              
                                            </div>
                                            <MapComponentStartEnd
                                                googleMapURL={this.props.auth.getGoogleApiUrl()}
                                                loadingElement={<div style={{height: `100%`}}/>}
                                                containerElement={<div style={{height: `75vh`}}/>}
                                                mapElement={<div style={{height: `100%`}}/>}
                                                defaultCenter={this.state.overallCenter}
                                                defaultZoom={this.state.overallZoom}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-content">
                                    <p><b>3. Route Preferences</b></p>
                                    <input type="checkbox" 
                                        name="elevation" 
                                        value="elevation" 
                                        required="true" 
                                        onChange={this.onCheckboxChange.bind(this)}
                                    defaultChecked/>
                                    Elevation Gain (ft): 
                                    <input type="text" 
                                        defaultValue={this.state["elevation"][1]}
                                        name="elevation_min" 
                                        onChange={this.onTextChange.bind(this)}
                                    /> 
                                    to <input type="text"
                                        defaultValue={this.state["elevation"][2]}
                                        name="elevation_max" 
                                        onChange={this.onTextChange.bind(this)}/>
                                    <br/><br/>
                                    Setting: 
                                    <input 
                                        type="radio" 
                                        name="setting" 
                                        value="urban"
                                        onChange={this.onRadioChange.bind(this)}
                                        defaultChecked/>Urban
                                    <input 
                                        type="radio" 
                                        name="setting" 
                                        onChange={this.onRadioChange.bind(this)}
                                        value="rural"/>Rural
                                    <input 
                                        type="radio" 
                                        name="setting" 
                                        onChange={this.onRadioChange.bind(this)}
                                        value="suburban"/>Suburban<br/>
                                    <br/><p>I would like to visit:</p>
                                    <div className="columns is-centered">
                                        <div className="column is-one-quarter has-text-left">
                                        <input type="checkbox" name="node" value="park" onChange={this.onCheckboxListChange.bind(this)}/> Parks<br/>
                                        <input type="checkbox" name="node" value="coffee" onChange={this.onCheckboxListChange.bind(this)}/> Coffeeshops<br/>
                                        <input type="checkbox" name="node" value="landmark" onChange={this.onCheckboxListChange.bind(this)}/> Landmarks<br/>
                                        <input type="checkbox" name="node" value="restaurant" onChange={this.onCheckboxListChange.bind(this)}/> Restaurants<br/>
                                        </div>
                                    </div>
                                    <p>I would like to travel on:</p>
                                    <div className="columns is-centered">
                                        <div className="column is-one-quarter has-text-left">
                                        <input type="checkbox" name="edge" value="bikepath" onChange={this.onCheckboxListChange.bind(this)}/> Bike Paths<br/>
                                        <input type="checkbox" name="edge" value="green" onChange={this.onCheckboxListChange.bind(this)}/> Green Space<br/>
                                        <input type="checkbox" name="edge" value="paved" onChange={this.onCheckboxListChange.bind(this)}/> Paved Roads<br/>
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
