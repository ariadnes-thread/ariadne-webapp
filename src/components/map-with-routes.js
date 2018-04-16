/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */


import {withScriptjs, withGoogleMap, Polyline, Polygon, InfoWindow, Marker, GoogleMap, DirectionsRenderer} from 'react-google-maps';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Auth from '../util/auth';

// Function for converting geometry into relevant `react-google-maps` components, see:
// https://farrrr.github.io/react-google-maps/#geojson
const geometryToComponentWithLatLng = function(geometry) {
    const typeFromThis = Array.isArray(geometry);
    const type = typeFromThis ? this.type : geometry.type;
    /** @type {object[]} */
    let coordinates = typeFromThis ? geometry : geometry.coordinates;

    switch (type) {
        case 'Polygon':
            return {
                ElementClass: Polygon,
                paths: coordinates.map(geometryToComponentWithLatLng, {type: 'LineString'})[0],
            };
        case 'LineString':
            coordinates = coordinates.map(geometryToComponentWithLatLng, {type: 'Point'});
            return typeFromThis ? coordinates : {
                ElementClass: Polyline,
                path: coordinates,
            };
        case 'Point':
            /* eslint-disable no-undef */
            coordinates = new google.maps.LatLng(coordinates[1], coordinates[0]);
            /* eslint-enable no-undef */
            return typeFromThis ? coordinates : {
                ElementClass: Marker,
                ChildElementClass: InfoWindow,
                position: coordinates,
            };
        default:
            throw new TypeError(`Unknown geometry type: ${ type }`);
    }
};

// GoogleMap component wrapper as per https://tomchentw.github.io/react-google-maps/#introduction
const MapComponent = withScriptjs(withGoogleMap(props => {
    // No geometry, try to render the route using directions.
    if (!props.geometry) {
        const mapComponent = <GoogleMap 
            onClick={props.kerflagle}
            defaultZoom={props.defaultZoom} 
            defaultCenter={props.defaultCenter}
        >
            {props.directions && props.directions.map((direction, idx) => {
                return (
                    <div key={'direction-input'+idx}>
                                    <DirectionsRenderer directions={direction}/>
                    </div>
                );
            })}
        </GoogleMap>;
        if (this.state)
        {
            mapComponent.fitBounds(this.state.bounds);
            mapComponent.center(this.state.bounds.getCenter());
        }
        return (mapComponent);

    }
    console.log('Rendering geometry', props.geometry);
    // Geometry is set, draw relevant component on the map (without consulting Google Maps API).
    const {ElementClass, ChildElementClass, ...geometry} = geometryToComponentWithLatLng(props.geometry);
    return (
        <GoogleMap defaultZoom={props.defaultZoom} defaultCenter={props.defaultCenter}>
            <ElementClass {...geometry}>
                {ChildElementClass ? <ChildElementClass {...{}} /> : null}
            </ElementClass>
        </GoogleMap>
    );
}));

export default class MapWithRoutes extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
        route: PropTypes.array,
        geometry: PropTypes.object,
        defaultZoom: PropTypes.number,
        defaultCenter: PropTypes.object,
    };

    static defaultProps = {
        route: [],
        defaultZoom: 16,
        defaultCenter: {lat: 34.138932, lng: -118.125339},
    };

    constructor(props) {
        super(props);

        this.state = {
            geometry: null,
            directions: []//null,
        };

        console.log(this.refs.mymap);
    }

    componentDidMount() {
        this.updateMap(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.updateMap(nextProps);
    }

    setDirections(directions) {
        this.setState({
            directions,
            geometry: null,
        })
    }

    setGeometry(geometry) {
        this.setState({
            geometry,
            directions: null,
        })
    }

    customOnClick(event) {
        console.log("IN ONCLICK");
        console.log(event);
    }

    updateMap(props) {
        if (props.geometry) {
            return this.setGeometry(props.geometry);
        }
        this.setState({directions: []});
        if (props.route) this.fetchDirectionBasedOnRoute(props.route);
    }

    fetchDirectionBasedOnRoute(coordArray) {
        // Need to disable `no-undef` check, otherwise ESLint complains about `google` being
        // undefined while it is actually provided by `react-google-maps` through `withGoogleMap`.
        /* eslint-disable no-undef */

        let bounds = new google.maps.LatLngBounds();
         this.setState(
            {directions: [],             
            bounds: bounds
         });

        const arrayClone = coordArray.slice(0);
        for (let n = 0; n < arrayClone.length; n++)
        {
            // Remove start/finish coords
            console.log(arrayClone[n]);
            const originCoord = arrayClone[n][0]//(arrayClone[n]).shift();
            const destCoord = arrayClone[n].slice(-1)[0]//arrayClone[n].pop();
            // Now `arrayClone[n]` only has inner coords

            const waypoints = new Array(arrayClone[n].length-2);
            for (let i = 0; i < arrayClone[n].length-2; i++) {
                const lat = arrayClone[n][i+1][0];
                const lng = arrayClone[n][i+1][1];
                waypoints[i] = {
                    location: `${lat}, ${lng}`,
                    stopover: true,
                };
                // bounds.extend(waypoints[i]);
            }
            console.log(waypoints);

            const origin = new google.maps.LatLng(originCoord[0], originCoord[1]);
            const destination = new google.maps.LatLng(destCoord[0], destCoord[1]);

            bounds.extend(origin);
            bounds.extend(destination);

            const DirectionsService = new google.maps.DirectionsService();

            DirectionsService.route({
                origin,
                destination,
                waypoints,
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.WALKING,
            }, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    this.setState({
                        bounds: bounds,
                        directions: this.state.directions.concat([result])//result, // TO DO: Make this display all the routes at once
                    });
                } else {
                    alert('Error'); // TODO: Replace this with nicer warning
                    console.error(`error fetching directions ${result}`);
                }
            });
        }
        /* eslint-enable no-undef */
    }

    render() {
        return (
            <MapComponent
                kerflagle={this.props.handleClick}
                defaultZoom={this.props.defaultZoom}
                defaultCenter={this.props.defaultCenter}
                googleMapURL={this.props.auth.getGoogleApiUrl()}
                loadingElement={<div style={{height: `100%`}}/>}
                containerElement={<div style={{height: `75vh`}}/>}
                mapElement={<div style={{height: `100%`}}/>}
                geometry={this.state.geometry}
                directions={this.state.directions}
            />
        );
    }
}
