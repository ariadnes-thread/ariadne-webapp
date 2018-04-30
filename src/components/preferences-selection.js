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


const MapComponentLocationRadius = compose(
    lifecycle({
        componentWillMount() {
            const refs = {}

            this.setState({
                bounds: null,
                center: {
                    lat: 41.9, lng: -87.624
                },
                markers: [],
                onMapMounted: ref => {
                    refs.map = ref;
                },
                onBoundsChanged: () => {
                    // this.setState({
                    //   bounds: refs.map.getBounds(),
                    //   center: refs.map.getCenter(),
                    // })
                    let sample = {center: refs.map.getCenter(), bounds: refs.map.getBounds()};
                    console.log(sample);
                    this.props.boundsChange(sample, this.props.parent, this.props.whichMap);
                },
                onSearchBoxMounted: ref => {
                    refs.searchBox = ref;
                },
                onPlacesChanged: () => {
                    const places = refs.searchBox.getPlaces();
                    /* eslint-disable no-undef */
                    const bounds = new google.maps.LatLngBounds();
                    /* eslint-enable no-undef */

                    places.forEach(place => {
                        if (place.geometry.viewport) {
                            bounds.union(place.geometry.viewport)
                        } else {
                            bounds.extend(place.geometry.location)
                        }
                    });
                    const nextMarkers = places.map(place => ({
                        position: place.geometry.location,
                    }));

                    const nextCenter = {};//_.get(nextMarkers, '0.position', this.state.center);

                    this.setState({
                        center: nextCenter,
                        markers: nextMarkers,
                    });
                    // refs.map.fitBounds(bounds);
                },
            })
        }
    }),
    withScriptjs,
    withGoogleMap
)(props =>
    <GoogleMap
        ref={props.onMapMounted}
        // ref={(locationRadiusMap) => {
        //     // console.log(locationRadiusMap);
        //     // console.log(locationRadiusMap.getBounds());
        //     return locationRadiusMap;
        // }}
        // ref={(map) => {
        //      if(map && props.bounds) {
        //         map.fitBounds(props.bounds);
        //         console.log(props.bounds);
        //         console.log(props.bounds.getCenter().lat() + ", " + props.bounds.getCenter().lng());
        //         map.panTo(props.bounds.getCenter());
        //     }}}
        // center={props.bounds ? props.bounds.getCenter() : props.defaultCenter}
        onClick={(eventData) =>{(props.clickHandle) ? props.clickHandle(props.parent, eventData, props.whichMap) : props.onBoundsChanged()}}
        defaultZoom={props.defaultZoom}
        defaultCenter={props.defaultCenter}
        onBoundsChanged={props.onBoundsChanged}

        // {() => {
        //     console.log(this);
        //     console.log(props);
        //     // console.log(locationRadiusMap);
        // // console.log(this.refs);
        // // console.log(this.refs.locationRadiusMap);
        // // console.log(this);
        // props.boundsChange}}//{(event)=> {console.log(event);console.log(map.getBounds());}}
    >
    </GoogleMap>);

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

        this.state = this.props.preferencesState.state;

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
                this.props.preferencesState.setPrefs({...this.state, prefSubmitted: true});
            }).then(() => {
                console.log("redirecting");
                console.log(this.props.preferencesState.getPrefs());
                this.props.history.push('/');
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

    // renderPointsOfInterestSelect() {
    //     const pointsOfInterest = this.state.pointsOfInterest;
    //     if (!pointsOfInterest) {
    //         // TODO: Add an indicator for failed loading
    //         return <option disabled>Loading...</option>;
    //     }
    //
    //     const optionsComponents = new Array(pointsOfInterest.length);
    //     for (let i = 0; i < pointsOfInterest.length; i++) {
    //         const point = pointsOfInterest[i];
    //         optionsComponents[i] = <option key={`poi-${i}`} value={i}>{point.name}</option>;
    //     }
    //     return optionsComponents;
    // }

    onBoundsChangedLocationRadius(mapInfo, parent, whichMap) {
        if (whichMap === "overall") {
            parent.setState({
                ...this.state,
                overallCenter: {lat: mapInfo.center.lat(), lng: mapInfo.center.lng()},
                overallBounds: mapInfo.bounds
            })
        }
        else if (whichMap === "start") {
            parent.setState({...this.state,
                startLocBounds: mapInfo.bounds,
                startLoc: {lat: mapInfo.center.lat(), lng: mapInfo.center.lng()}
            })
        }
        else if (whichMap === "end") {
            parent.setState({...this.state,
                endLocBounds: mapInfo.bounds,
                endLoc: {lat: mapInfo.center.lat(), lng: mapInfo.center.lng()}
            })
        }
    }

    onClickStartEnd(parent, eventData, whichMap) {
        /* eslint-disable no-undef */
        if (whichMap === "start") {
            parent.setState({...this.state,
                startLoc: {lat: eventData.latLng.lat(), lng: eventData.latLng.lng()}
            })
        }
        else if (whichMap === "end") {
            parent.setState({...this.state,
                endLoc: {lat: eventData.latLng.lat(), lng: eventData.latLng.lng()}
            })
        }

        const geocoder = new google.maps.Geocoder();
        /* eslint-enable no-undef */
        geocoder.geocode({'location' : {lat: eventData.latLng.lat(), lng: eventData.latLng.lng()}}, function(results, status)
        {
            if (status === 'OK')
            {
                if (results[0])
                {
                    for (let i = 0; i < results[0].address_components.length; i++)
                    {
                        console.log(results[0].address_components[i]);
                        if (results[0].address_components[i].types[0] === "postal_code")
                        {
                            let zip = results[0].address_components[i].short_name;
                            console.log("ZIP", zip);
                            // callback.setZip(zip, callback);
                        }

                    }
                }
            }
        });
    }

    onRadioChange(event) {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value
        })
    }

    onCheckboxChange(event) {
        this.setState({
            ...this.state,
            [event.target.value]: [event.target.checked, this.state[event.target.value][1], this.state[event.target.value][2]]
        })
    }

    onCheckboxListChange(event) {
        let prev_list = this.state[event.target.name];
        if (event.target.checked && !prev_list.includes(event.target.value)) {
            prev_list.push(event.target.value)
            this.setState({
                ...this.state,
                [event.target.name]: prev_list
            });
        }
        else if (!event.target.checked && prev_list.includes(event.target.value)) {
            const index = prev_list.indexOf(event.target.value);
            prev_list.splice(index, 1);
            this.setState({
                ...this.state,
                [event.target.name]: prev_list
            });
        }
    }

    onTextChange(event) {
        const prop_name = event.target.name.split("_");
        if (prop_name[1] === "min") {
            this.setState({
                ...this.state,
                [prop_name[0]]: [this.state[prop_name[0]][0], event.target.value, this.state[prop_name[0]][2]]
            })
        }
        else if (prop_name[1] === "max") {
            this.setState({
                ...this.state,
                [prop_name[0]]: [this.state[prop_name[0]][0], this.state[prop_name[0]][1], event.target.value]
            })
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
                                            whichMap="overall"
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
                                                <MapComponentLocationRadius
                                                    googleMapURL={this.props.auth.getGoogleApiUrl()}
                                                    loadingElement={<div style={{height: `100%`}}/>}
                                                    containerElement={<div style={{height: `75vh`}}/>}
                                                    mapElement={<div style={{height: `100%`}}/>}
                                                    defaultCenter={this.state.overallCenter}
                                                    defaultZoom={this.state.overallZoom}
                                                    whichMap="start"
                                                    parent={this}
                                                    clickHandle={this.onClickStartEnd}
                                                    boundsChange={this.onBoundsChangedLocationRadius}
                                                />
                                            </div>
                                            <div className="column"
                                                 style={{display: (this.state.loop) ? "none" : ""}}>Ending Location:
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
                                                <MapComponentLocationRadius
                                                    googleMapURL={this.props.auth.getGoogleApiUrl()}
                                                    loadingElement={<div style={{height: `100%`}}/>}
                                                    containerElement={<div style={{height: `75vh`}}/>}
                                                    mapElement={<div style={{height: `100%`}}/>}
                                                    defaultCenter={this.state.overallCenter}
                                                    defaultZoom={this.state.overallZoom}
                                                    whichMap="end"
                                                    parent={this}
                                                    clickHandle={this.onClickStartEnd}
                                                    boundsChange={this.onBoundsChangedLocationRadius}
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
                                                <input type="checkbox" name="node" value="park"
                                                       onChange={this.onCheckboxListChange.bind(this)}/> Parks<br/>
                                                <input type="checkbox" name="node" value="coffee"
                                                       onChange={this.onCheckboxListChange.bind(this)}/> Coffeeshops<br/>
                                                <input type="checkbox" name="node" value="landmark"
                                                       onChange={this.onCheckboxListChange.bind(this)}/> Landmarks<br/>
                                                <input type="checkbox" name="node" value="restaurant"
                                                       onChange={this.onCheckboxListChange.bind(this)}/> Restaurants<br/>
                                            </div>
                                        </div>
                                        <p>I would like to travel on:</p>
                                        <div className="columns is-centered">
                                            <div className="column is-one-quarter has-text-left">
                                                <input type="checkbox" name="edge" value="bikepath"
                                                       onChange={this.onCheckboxListChange.bind(this)}/> Bike Paths<br/>
                                                <input type="checkbox" name="edge" value="green"
                                                       onChange={this.onCheckboxListChange.bind(this)}/> Green
                                                Space<br/>
                                                <input type="checkbox" name="edge" value="paved"
                                                       onChange={this.onCheckboxListChange.bind(this)}/> Paved
                                                Roads<br/>
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
                </div>
            </div>
        );
    }
}
