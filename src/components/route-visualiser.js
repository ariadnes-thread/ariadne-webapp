/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import {withScriptjs, withGoogleMap, GoogleMap, Marker} from 'react-google-maps';
import React, {Component} from 'react';


// Generate JSON for the example route and make formatting prettier
const EXAMPLE_ROUTE = {
    route: [
        [34.140930, -118.129366],
        [34.140947, -118.128010],
        [34.140388, -118.128002],
        [34.139434, -118.122862],
    ],
};
const EXAMPLE_ROUTE_JSON = JSON
    .stringify(EXAMPLE_ROUTE, null, 2)
    .replace(/\[\s+(-?\d+(.\d+)?),\s+(-?\d+(.\d+)?)\s+]/g, function () {
        // ^ this has to be `function` for `arguments` to work, doesn't work wih arrows function :/
        const lat = arguments[1];
        const lng = arguments[3];
        return `[${lat}, ${lng}]`;
    });


// Setup GoogleMap component as per https://tomchentw.github.io/react-google-maps/#introduction
const MapComponent = withScriptjs(withGoogleMap((props) =>
    <GoogleMap
        defaultZoom={16}
        defaultCenter={{lat: 34.138, lng: -118.125}}>
        {props.isMarkerShown && <Marker position={{lat: -34.397, lng: 150.644}}/>}
    </GoogleMap>,
));


export default class RouteVisualiser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            jsonInput: EXAMPLE_ROUTE_JSON,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        event.preventDefault();
        this.setState({jsonInput: event.target.value});
    }

    handleSubmit() {

    }

    render() {
        return (
            <section className="section ariadne-section-uniform-padding">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-one-third has-text-left">
                            <div className="card">
                                <div className="card-content">
                                    <p>Drop your JSON into the text box below.</p>
                                    <br/>
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="field">
                                            <div className="control">
                                                <textarea
                                                    onChange={this.handleChange}
                                                    style={{minHeight: '250px'}}
                                                    className="textarea"
                                                    placeholder={EXAMPLE_ROUTE_JSON}
                                                    value={this.state.jsonInput}/>
                                            </div>
                                        </div>
                                    </form>
                                    <br/>
                                    <button className="button is-info">Update route</button>
                                    <br/>
                                    <hr/>
                                    <p>Example structure (latitude first):</p>
                                    <br/>
                                    <pre><code>{EXAMPLE_ROUTE_JSON}</code></pre>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="card">
                                <div className="card-content ariadne-no-padding">
                                    <MapComponent
                                        isMarkerShown={false}
                                        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                                        loadingElement={<div style={{height: `100%`}}/>}
                                        containerElement={<div style={{height: `500px`}}/>}
                                        mapElement={<div style={{height: `100%`}}/>}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
