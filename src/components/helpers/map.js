/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import {Map as LeafletMap, TileLayer, Marker, Popup, GeoJSON} from 'react-leaflet';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Auth from '../../util/auth';

const blueRouteStyle = {
    name: 'blue',
    color: '#5587c6',
    outline: '#2b297a',
};
const purpleRouteStyle = {
    name: 'purple',
    color: '#d581c2',
    outline: '#612050',
};

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

        this.routeStyle = blueRouteStyle;

        this.handleClick = this.handleClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.geoJsonObjects !== nextProps.geoJsonObjects) {
           if (this.routeStyle.name === blueRouteStyle.name) {
                this.routeStyle = purpleRouteStyle;
           } else {
                this.routeStyle = blueRouteStyle;
           }
        }

        this.forceUpdate();
    }

    handleClick(event) {
        if (this.props.onMapClick) this.props.onMapClick(event);
    }

    getStartAndFinish(coordinates) {
        // Goes down nested arrays to find the first or last leaf array
        const descendToLeafArray = (value, first) => {
            const index = first ? 0 : value.length - 1;
            const nextValue = value[index];
            if (nextValue instanceof Array)
                return descendToLeafArray(nextValue, first);

            return value.slice(0);
        };

        return {
            start: descendToLeafArray(coordinates, true).reverse(),
            finish: descendToLeafArray(coordinates, false).reverse(),
        };
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
        const components = new Array(count * 4);
        for (let i = 0; i < count; i++) {
            const data = this.props.geoJsonObjects[i];
            const pathStyle = {
                color: this.routeStyle.color,
                weight: 4,
            };
            const outlineStyle = {
                color: this.routeStyle.outline,
                weight: 7,
            };

            const key = `${i}-${Math.random()}`;
            components[i * 4] = <GeoJSON className="ariadne-route-svg-shadow"
                                         key={`${key}-o`}
                                         data={data} style={outlineStyle}/>;
            components[i * 4 + 1] = <GeoJSON key={`${key}-p`}
                                             data={data} style={pathStyle}/>;

            const points = this.getStartAndFinish(data.coordinates); 
            components[i * 4 + 2] = <Marker key={`${key}-s`} position={points.start}/>;
            components[i * 4 + 3] = <Marker key={`${key}-f`} position={points.finish}/>;
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
            </LeafletMap>
        );
    }

}
