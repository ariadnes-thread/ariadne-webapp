/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import {withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer} from 'react-google-maps';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Auth from '../util/auth';

// GoogleMap component wrapper as per https://tomchentw.github.io/react-google-maps/#introduction
const MapComponent = withScriptjs(withGoogleMap(props =>
    <GoogleMap defaultZoom={props.defaultZoom} defaultCenter={props.defaultCenter}>
        {props.directions &&
                            props.directions.map((direction, idx) => {
                                return (<div key={'direction-input'+idx}>
                                	<DirectionsRenderer directions={direction}/>
                                </div>);
                            })
                        }
    </GoogleMap>,
));

// const MapComponent = withScriptjs(withGoogleMap(props =>
//     <GoogleMap defaultZoom={props.defaultZoom} defaultCenter={props.defaultCenter}>
//         {props.directions && <DirectionsRenderer directions={props.directions}/>}
//     </GoogleMap>,
// ));

export default class MapWithRoutes extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
        route: PropTypes.array,
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
            directions: []//null,
        };
    }

    componentDidMount() {
        if (this.props.route) this.fetchDirectionBasedOnRoute(this.props.route);
    }

    componentWillReceiveProps(nextProps) {
    	        console.log(nextProps);
    	 this.setState({directions: []});
        if (nextProps.route) this.fetchDirectionBasedOnRoute(nextProps.route);
        else this.setState({directions: []});
    }

    fetchDirectionBasedOnRoute(coordArray) {
        // Need to disable `no-undef` check, otherwise ESLint complains about `google` being
        // undefined while it is actually provided by `react-google-maps` through `withGoogleMap`.
        /* eslint-disable no-undef */


        const arrayClone = coordArray.slice(0);

        console.log(arrayClone);

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
	        }
	        console.log(waypoints);

	        const origin = new google.maps.LatLng(originCoord[0], originCoord[1]);
	        const destination = new google.maps.LatLng(destCoord[0], destCoord[1]);

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
	                    directions: this.state.directions.concat([result])//result, // TO DO: Make this display all the routes at once
	                });
	            } else {
	                alert('Error'); // TODO: Replace this with nicer warning
	                console.error(`error fetching directions ${result}`);
	            }
	        });
	    }
    }

    render() {

        return (
            <MapComponent
                defaultZoom={this.props.defaultZoom}
                defaultCenter={this.props.defaultCenter}
                googleMapURL={this.props.auth.getGoogleApiUrl()}
                loadingElement={<div style={{height: `100%`}}/>}
                containerElement={<div style={{height: `500px`}}/>}
                mapElement={<div style={{height: `100%`}}/>}
                directions={this.state.directions}
            />
        );
    }
}
