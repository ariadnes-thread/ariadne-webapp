/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import {Map as LeafletMap, TileLayer, Marker, GeoJSON} from 'react-leaflet';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import PreferencesState, {PreferenceSchema} from '../../util/preferences-state';
import {PoiTypes} from '../../util/preferences-state';
import Auth from '../../util/auth';
import Util from '../../util/util';

const blueRouteStyle = {
    name: 'blue',
    color: '#5587c6',
    outline: '#2b297a',
    highlight: '#ff0000',
    highlightOutline: '#420000',
};

const purpleRouteStyle = {
    name: 'purple',
    color: '#d581c2',
    outline: '#612050',
    highlight: '#ff0000',
    highlightOutline: '#420000',
};

export default class Map extends Component {

    static propTypes = {
        prefState: PropTypes.instanceOf(PreferencesState),
        auth: PropTypes.instanceOf(Auth).isRequired,
        onMapClick: PropTypes.func,
        geoJsonObjects: PropTypes.arrayOf(PropTypes.object),
        clickMessage: PropTypes.string,
        onMapClickCancel: PropTypes.func,
        highlightUntilIndex: PropTypes.number,
        pois: PropTypes.array,
    };

    static defaultProps = {
        geoJsonObjects: [],
    };

    constructor(props) {
        super(props);

        if (this.props.prefState) this.prefState = this.props.prefState;
        else throw new Error('No `prefState` specified in PreferenceEditor props!');

        this.state = {
            lat: 34.139,
            lng: -118.125,
            zoom: 14,

            routeStyle: blueRouteStyle,
            geoJsonObjects: [],
            routeLatLngCoordinates: null,
            start: null,
            finish: null,
        };

        this.prefUpdateListener = this.prefUpdateListener.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
    }

    /**
     * @param {object} data
     * @param {string} data.name
     * @param {string} data.value
     */
    prefUpdateListener(data) {
        if (data.name === PreferenceSchema.origin.name && data.value) {
            const coords = data.value;
            this.setState({start: [coords.latitude, coords.longitude]});
        } else if (data.name === PreferenceSchema.destination.name && data.value) {
            const coords = data.value;
            this.setState({finish: [coords.latitude, coords.longitude]});
        }
    }

    componentDidMount() {
        this.prefState.addUpdateListener(this.prefUpdateListener, {forceUpdate: true});
        this.leafletElement = this.refs.map.leafletElement;

        /* eslint-disable no-undef */
        this.Icon = L.Icon.extend({
            options: {
                iconSize: [35, 45],
                iconAnchor: [17, 42],
                popupAnchor: [1, -32],
                shadowAnchor: [10, 12],
                shadowSize: [36, 16],
                className: 'awesome-marker',
                prefix: 'fa',
                spinClass: 'fa-spin',
                extraClasses: '',
                icon: 'home',
                markerColor: 'blue',
                iconColor: 'white',
            },
            initialize: function (options) {
                options = L.Util.setOptions(this, options);
            },
            createIcon: function () {
                let div = document.createElement('div'),
                    options = this.options;
                if (options.icon) {
                    div.innerHTML = this._createInner();
                }
                if (options.bgPos) {
                    div.style.backgroundPosition =
                        `${-options.bgPos.x}px ${-options.bgPos.y}px`;
                }
                this._setIconStyles(div, `icon-${options.markerColor}`);
                return div;
            },
            _createInner: function () {
                let iconClass, iconSpinClass = '', iconColorClass = '', iconColorStyle = '';
                const options = this.options;
                if (options.icon.slice(0, options.prefix.length + 1) === `${options.prefix}-`) {
                    iconClass = options.icon;
                } else {
                    iconClass = `${options.prefix}-${options.icon}`;
                }
                if (options.spin && typeof options.spinClass === 'string') {
                    iconSpinClass = options.spinClass;
                }

                if (options.iconColor) {
                    if (options.iconColor === 'white' || options.iconColor === 'black') {
                        iconColorClass = `icon-${options.iconColor}`;
                    } else {
                        iconColorStyle = `style='color: ${options.iconColor}' `;
                    }
                }
                return `<i ${iconColorStyle}class='${options.extraClasses} ${options.prefix} ${iconClass} ${iconSpinClass} ${iconColorClass}'></i>`;
            },
            _setIconStyles: function (img, name) {
                const options = this.options;
                const size = L.point(options[name === 'shadow' ? 'shadowSize' : 'iconSize']);
                let anchor;
                if (name === 'shadow') {
                    anchor = L.point(options.shadowAnchor || options.iconAnchor);
                } else {
                    anchor = L.point(options.iconAnchor);
                }
                if (!anchor && size) {
                    anchor = size.divideBy(2, true);
                }
                img.className = `awesome-marker-${name} ${options.className}`;
                if (anchor) {
                    img.style.marginLeft = `${-anchor.x}px`;
                    img.style.marginTop = `${-anchor.y}px`;
                }
                if (size) {
                    img.style.width = `${size.x}px`;
                    img.style.height = `${size.y}px`;
                }
            },
            createShadow: function () {
                const div = document.createElement('div');
                this._setIconStyles(div, 'shadow');
                return div;
            },
        });
        this.forceUpdate();
        /* eslint-enable no-undef */
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.prefState !== nextProps.prefState) {
            this.prefState = nextProps.prefState;
            this.prefState.addUpdateListener(this.prefUpdateListener);
        }

        if (this.props.geoJsonObjects !== nextProps.geoJsonObjects)
            this.prepareForNewRoute(nextProps.geoJsonObjects);
    }

    prepareForNewRoute(geoJsonObjects) {
        const newState = {
            geoJsonObjects,
            routeLatLngCoordinates: null,
            start: null,
            finish: null,
        };

        if (this.state.routeStyle.name === blueRouteStyle.name) {
            newState.routeStyle = purpleRouteStyle;
        } else {
            newState.routeStyle = blueRouteStyle;
        }

        if (geoJsonObjects.length > 0 && geoJsonObjects[0]) {
            const routeGeoJson = geoJsonObjects[0];
            const coordinates = _.flatten(routeGeoJson.coordinates);

            const coordinateCount = Math.round(coordinates.length / 2.0);
            const latLngCoordinates = new Array(coordinateCount);
            for (let i = 0; i < coordinateCount; i++) {
                const lng = coordinates[i * 2];
                const lat = coordinates[i * 2 + 1];
                latLngCoordinates[i] = [lat, lng];
            }
            this.leafletElement.fitBounds(latLngCoordinates, {padding: [5, 5]});
            newState.routeLatLngCoordinates = latLngCoordinates;
            newState.start = latLngCoordinates[0];
            newState.finish = latLngCoordinates[coordinateCount - 1];
        }

        this.setState(newState);
    }

    handleMapClick(event) {
        if (this.props.onMapClick) this.props.onMapClick(event);
        else Util.logWarn(`No 'onMapClick()' function was passed through props, ignoring the map click.`);
    }

    handleCancelClick(event) {
        event.preventDefault();
        if (this.props.onMapClickCancel) this.props.onMapClickCancel(event);
        else Util.logWarn(`No 'onMapClickCancel()' function was passed through props, ignoring the cancel click.`);
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

    renderGeoJson() {
        const geoJsonObjects = this.state.geoJsonObjects;
        const components = [];
        for (const data of geoJsonObjects) {
            // Create separate data for the highlight line
            const coords = data.coordinates;
            const highlightData = {
                type: data.type,
                coordinates: this.props.highlightUntilIndex ?
                    coords.slice(0, this.props.highlightUntilIndex + 1) : [],
            };

            const highlightStyle = {
                color: this.state.routeStyle.highlight,
                weight: 8,
            };
            const highlightOutlineStyle = {
                color: this.state.routeStyle.highlightOutline,
                weight: 12,
            };
            const pathStyle = {
                color: this.state.routeStyle.color,
                weight: 4,
            };
            const outlineStyle = {
                color: this.state.routeStyle.outline,
                weight: 7,
            };

            const key = `${Math.random()}`;
            components.push(
                <GeoJSON className="ariadne-route-svg-shadow" key={`${key}-o`} data={data} style={outlineStyle}/>);
            components.push(<GeoJSON key={`${key}-p`} data={data} style={pathStyle}/>);

            if (this.props.highlightUntilIndex !== null) {
                components.push(<GeoJSON key={`${key}-h`} data={highlightData} style={highlightOutlineStyle}/>);
                components.push(<GeoJSON key={`${key}-ho`} data={highlightData} style={highlightStyle}/>);
            }
        }

        return components;
    }

    renderMarkers() {

        const markers = [];

        if (this.props.pois) {
            for (const poi of this.props.pois) {
                const key = `${Math.random()}`;
                const poiType = PoiTypes[poi.type];

                let typeName = poiType ? poiType.displayName : null;
                if (!typeName) typeName = poi.type.replace(/^\w/, c => c.toUpperCase());

                let iconName = poiType ? poiType.icon : null;
                if (!iconName) iconName = 'star';

                markers.push({
                    key,
                    iconName,
                    position: [poi.location.latitude, poi.location.longitude],
                    color: 'green',
                });
            }
        }

        if (this.state.start) {
            markers.push({
                key: `${Math.random()}-s`,
                iconName: 'asterisk',
                position: this.state.start,
                color: 'blue',
            });
        }
        if (this.state.finish) {
            markers.push({
                key: `${Math.random()}-f`,
                iconName: 'flag',
                position: this.state.finish,
                color: 'blue',
            });
        }

        const components = new Array(markers.length);
        for (let i = 0; i < markers.length; i++) {
            const marker = markers[i];
            let style = null;
            if (this.Icon) {
                style = new this.Icon({
                    icon: marker.iconName,
                    markerColor: marker.color,
                });
            }
            components[i] = <Marker key={marker.key} icon={style} position={marker.position}/>;
        }

        return components;
    }

    render() {
        const position = [this.state.lat, this.state.lng];
        const mapClass = this.props.clickMessage ? 'ariadne-crosshair-cursor' : '';
        return (
            <div className="leaflet-container-wrapper">
                {this.props.clickMessage &&
                <div className="ariadne-map-text">
                    <div className="notification is-info is-size-5">
                        <a className="is-pulled-right" onClick={this.handleCancelClick}>Cancel</a>
                        {this.props.clickMessage}
                        <div className="is-clearfix"/>
                    </div>
                </div>
                }
                <LeafletMap ref="map" className={mapClass} center={position} zoom={this.state.zoom}
                            onClick={this.handleMapClick}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright\">OpenStreetMap</a> contributors'
                        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=${this.props.auth.config.mapboxAccessToken}`}
                    />
                    {this.renderGeoJson()}
                    {this.renderMarkers()}
                </LeafletMap>
            </div>
        );
    }

}
