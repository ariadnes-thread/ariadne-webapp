/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import {Map as LeafletMap, TileLayer, Marker, Popup, GeoJSON} from 'react-leaflet';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';

import Auth from '../../util/auth';

export default class Map extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
        onMapClick: PropTypes.func,
        geoJsonObjects: PropTypes.arrayOf(PropTypes.object),
    };

    static defaultProps = {
        geoJsonObjects: [],
    };

    constructor() {
        super();
        this.state = {
            lat: 34.139,
            lng: -118.125,
            zoom: 14,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    componentWillReceiveProps() {
        this.forceUpdate();
    }

    handleClick(event) {
        if (this.props.onMapClick) this.props.onMapClick(event);
    }

    renderGeoJson() {
        const count = this.props.geoJsonObjects.length;
        const components = new Array(count);
        for (let i = 0; i < count; i++) {
            const data = this.props.geoJsonObjects[i];
            const style = {
                color: `#${tinycolor.random().toHex()}`,
                weight: 10,
                opacity: 0.75,
            };

            components[i] = <GeoJSON key={`${i}-${Math.random()}`} data={data} style={style}/>;
        }
        return components;
    }

    render() {
        const position = [this.state.lat, this.state.lng];
        return (
            <LeafletMap ref="map" center={position} zoom={this.state.zoom} onClick={this.handleClick}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright\">OpenStreetMap</a> contributors'
                    url={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=${this.props.auth.config.mapboxAccessToken}`}
                />
                {this.renderGeoJson()}
                <Marker position={position}>
                    <Popup>
                        <span>A pretty CSS3 popup. <br/> Easily customizable.</span>
                    </Popup>
                </Marker>
            </LeafletMap>
        );
    }

}
