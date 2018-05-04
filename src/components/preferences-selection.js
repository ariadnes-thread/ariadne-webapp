/**
 * @author Mary Giambrone
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

// import Icon from '@fortawesome/react-fontawesome';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
} from 'react-google-maps';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Promise from 'bluebird';
import {compose, lifecycle} from 'recompose';

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
                    let mapData = {center: refs.map.getCenter(), bounds: refs.map.getBounds()};
                    this.props.boundsChange(mapData, this.props.parent, this.props.whichMap);
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
        onClick={(eventData) =>{(props.clickHandle) ? props.clickHandle(props.parent, eventData, props.whichMap) : props.onBoundsChanged()}}
        defaultZoom={props.defaultZoom}
        defaultCenter={props.defaultCenter}
        onBoundsChanged={props.onBoundsChanged}
    >
    </GoogleMap>);

export default class PreferencesSelection extends Component {

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
        console.log("submitting preferencecs");
        console.log({...this.state, prefSubmitted: true});

        return Promise.resolve()
            .then(() => {
                this.props.preferencesState.setPrefs({...this.state, prefSubmitted: true});
            }).then(() => {
                this.props.history.push('/view-route');
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
                origin: {lat: mapInfo.center.lat(), lng: mapInfo.center.lng()}
            })
        }
        else if (whichMap === "end") {
            parent.setState({...this.state,
                endLocBounds: mapInfo.bounds,
                destination: {lat: mapInfo.center.lat(), lng: mapInfo.center.lng()}
            })
        }
    }

    onClickStartEnd(parent, eventData, whichMap) {
        /* eslint-disable no-undef */
        if (whichMap === "start") {
            parent.setState({...this.state,
                origin: {lat: eventData.latLng.lat(), lng: eventData.latLng.lng()}
            })
        }
        else if (whichMap === "end") {
            parent.setState({...this.state,
                destination: {lat: eventData.latLng.lat(), lng: eventData.latLng.lng()}
            })
        }

        // const geocoder = new google.maps.Geocoder();
        // /* eslint-enable no-undef */
        // geocoder.geocode({'location' : {lat: eventData.latLng.lat(), lng: eventData.latLng.lng()}}, function(results, status)
        // {
        //     if (status === 'OK')
        //     {
        //         if (results[0])
        //         {
        //             for (let i = 0; i < results[0].address_components.length; i++)
        //             {
        //                 console.log(results[0].address_components[i]);
        //                 if (results[0].address_components[i].types[0] === "postal_code")
        //                 {
        //                     let zip = results[0].address_components[i].short_name;
        //                     console.log("ZIP", zip);
        //                     // callback.setZip(zip, callback);
        //                 }
        //
        //             }
        //         }
        //     }
        // });
    }

    onRadioChange(event) {
        this.setState({
            ...this.state,
            [event.target.name]: this.props.preferencesState[event.target.name][event.target.value]
        });
    }

    onCheckboxChange(event) {
        this.setState({
            ...this.state,
            [event.target.value]: {...this.state[event.target.value],
                "userEnabled": event.target.checked}
        });
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
        this.setState({
            ...this.state,
            [prop_name[0]]: {...this.state[prop_name[0]],
                [prop_name[1]]: event.target.value}
        });
    }

    onSelectChange(event) {
        console.log(event.target);
        console.log(event.target.name);
        console.log(event.target.value);
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value
        });
    }

    renderStartEndSelect() {
        const options = Object.keys(this.props.preferencesState.nodeType); //["Park", "Bus Stop", "Monument", "Mall", "Restaurant"];
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
                                                       name="routeMode"
                                                       value="bike"
                                                       onChange={this.onRadioChange.bind(this)}
                                                       defaultChecked/><br/>Biking
                                            </div>
                                            <div className="column">
                                                <input type="radio"
                                                       name="routeMode"
                                                       onChange={this.onRadioChange.bind(this)}
                                                       value="run"/><br/>Running
                                            </div>
                                        </div>
                                        <p>Loop or Point-to-Point?</p>
                                        <p>(insert nice drawings here)</p>
                                        <div className="columns is-centered">
                                            <div className="column">
                                                <input type="radio"
                                                       name="routeType"
                                                       value="loop"
                                                       onChange={this.onRadioChange.bind(this)}
                                                       defaultChecked/><br/>Loop
                                            </div>
                                            <div className="column">
                                                <input type="radio"
                                                       name="routeType"
                                                       onChange={this.onRadioChange.bind(this)}
                                                       value="pointToPoint"/><br/>Point-To-Point
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
                                                           required={!this.state.time.userEnabled}
                                                           onChange={this.onCheckboxChange.bind(this)}
                                                           defaultChecked/>
                                                    Distance (miles):
                                                </div>
                                            </div>
                                            <div className="column is-one-third has-text-left">
                                                <div className="column has-text-left">
                                                    <div className="field is-horizontal">
                                                        <input
                                                            type="text"
                                                            name="time_min"
                                                            className="input"
                                                            defaultValue={this.state.time.min}
                                                            onChange={this.onTextChange.bind(this)}/>
                                                        <label className="is-normal"> to </label>
                                                        <input
                                                            type="text"
                                                            name="time_max"
                                                            className="input"
                                                            defaultValue={this.state.time.max}
                                                            onChange={this.onTextChange.bind(this)}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="columns is-centered">
                                            <div className="column is-one-quarter has-text-right">
                                                <div className="column has-text-left">
                                                    <input
                                                        type="checkbox"
                                                        name="length"
                                                        value="time"
                                                        onChange={this.onCheckboxChange.bind(this)}
                                                        required={!this.state.desiredLength.userEnabled}/>
                                                    Time (minutes):<br/>
                                                </div>
                                            </div>
                                            <div className="column is-one-third has-text-left">
                                                <div className="column has-text-left">
                                                    <div className="field is-horizontal">
                                                        <input
                                                            type="text"
                                                            name="time_min"
                                                            className="input"
                                                            defaultValue={this.state.time.min}
                                                            onChange={this.onTextChange.bind(this)}/>
                                                        <label className="is-normal"> to </label>
                                                        <input
                                                            type="text"
                                                            name="time_max"
                                                            className="input"
                                                            defaultValue={this.state.time.max}
                                                            onChange={this.onTextChange.bind(this)}/>
                                                    </div><br/>
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
                                                            name="start"
                                                            value="specific"
                                                            onChange={this.onRadioChange.bind(this)}
                                                            defaultChecked/><br/>Specific Location(s)
                                                    </div>
                                                    <div className="column">
                                                        <input
                                                            type="radio"
                                                            name="start"
                                                            onChange={this.onRadioChange.bind(this)}
                                                            value="type"/><br/>Type of Location in an area
                                                        <br/>
                                                        <select name="startType" onChange={this.onSelectChange.bind(this)}>
                                                            {this.renderStartEndSelect()}</select>
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
                                                               name="end"
                                                               value="specific"
                                                               onChange={this.onRadioChange.bind(this)}
                                                               defaultChecked/><br/>Specific Location(s)
                                                    </div>
                                                    <div className="column">
                                                        <input type="radio"
                                                               name="end"
                                                               onChange={this.onRadioChange.bind(this)}
                                                               value="type"/><br/>Type of Location in an area
                                                        <br/><select  name="endType" onChange={this.onSelectChange.bind(this)}>
                                                        {this.renderStartEndSelect()}</select>
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
                                        <div className="field is-horizontal">

                                            <input type="checkbox"
                                                   name="elevation"
                                                   value="elevation"
                                                   onChange={this.onCheckboxChange.bind(this)}
                                                   defaultChecked/>
                                            <label className="label"> Elevation Gain (ft): </label>
                                            <input type="text"
                                                   defaultValue={this.state.elevation.min}
                                                   name="elevation_min"
                                                   className="input field-body"
                                                   onChange={this.onTextChange.bind(this)}
                                            />
                                            to <input type="text"
                                                      defaultValue={this.state.elevation.max}
                                                      name="elevation_max"
                                                      className="input field-body"
                                                      onChange={this.onTextChange.bind(this)}/>
                                        </div>
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
                                                {Object.keys(this.props.preferencesState.nodeType).map((name, idx) =>
                                                    <div className={"node"+idx}>
                                                        <input type="checkbox" name="node" value={name}
                                                               onChange={this.onCheckboxListChange.bind(this)}/> {name} <br/>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p>I would like to travel on:</p>
                                        <div className="columns is-centered">
                                            <div className="column is-one-quarter has-text-left">
                                                {Object.keys(this.props.preferencesState.edgeType).map((name, idx) =>
                                                    <div className={"edge"+idx}>
                                                        <input type="checkbox" name="edge" value={name}
                                                               onChange={this.onCheckboxListChange.bind(this)}/> {name} <br/>
                                                    </div>
                                                )}
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
