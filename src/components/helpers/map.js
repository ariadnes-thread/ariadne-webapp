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

    renderSvgFilterMarkup() {
        return (
            <svg xmlns="w3.org/2000/svg" version="1.1">
                <defs>
                    <filter id="dropshadow" height="130%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                        <feOffset dx="2" dy="2" result="offsetblur"/>
                        <feMerge></feMerge>
                        <feMergeNode in="SourceGraphic"/>
                    </filter>
                </defs>
            </svg>
        );
    }

    renderGeoJson() {
        const count = this.props.geoJsonObjects.length;
        const components = new Array(count * 2);
        for (let i = 0; i < count; i++) {
            const data = this.props.geoJsonObjects[i];
            const pathStyle = {
                color: '#5587c6',
                weight: 4,
            };
            const outlineStyle = {
                color: '#2b297a',
                weight: 7,
            };

            components[i * 2] = <GeoJSON className="ariadne-route-svg-shadow"
                                         key={`${i}-${Math.random()}`}
                                         data={data} style={outlineStyle}/>;
            components[i * 2 + 1] = <GeoJSON key={`${i}-${Math.random()}`}
                                             data={data} style={pathStyle}/>;
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
