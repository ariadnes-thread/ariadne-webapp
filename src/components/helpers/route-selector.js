/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import Icon from '@fortawesome/react-fontawesome';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TweenMax} from 'gsap';

import {PoiTypes} from '../../util/preferences-state';
import ElevationView from './elevation-view';
import IconButton from './icon-button';

export default class RouteSelector extends Component {

    static propTypes = {
        allRoutes: PropTypes.array.isRequired,
        selectedRoute: PropTypes.number.isRequired,
        highlightRouteUntil: PropTypes.func.isRequired,
        showPreferenceEditor: PropTypes.func.isRequired,
        chooseRoute: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.containerRef = React.createRef();
        this.onRouteClick = this.onRouteClick.bind(this);
    }

    componentWillEnter(callback) {
        this.containerRef.current.style.position = 'absolute';
        TweenMax.fromTo(this.containerRef.current, 0.3,
            {x: 200, opacity: 0, position: 'absolute'},
            {x: 0, opacity: 1, position: 'relative', onComplete: callback}
        );
    }

    componentWillLeave(callback) {
        this.containerRef.current.style.position = 'absolute';
        TweenMax.fromTo(this.containerRef.current, 0.3,
            {x: 0, opacity: 1, position: 'absolute'},
            {x: 200, opacity: 0, onComplete: callback}
        );
    }

    getElevationData(routeData) {
        const elevationData = routeData.elevationData;
        if (!elevationData || elevationData.length === 0)
            return null;
        let distance = 0;
        let elevations = [];
        let labels = [];
        let indices = new Array(elevationData.length)
        for (let i = 0; i < elevationData.length; i++) {
            if (elevationData[i][1]) {
                elevations.push((elevationData[i][1]).toFixed(2));
                labels.push((distance / 1609.34).toFixed(2));
            }
            if (elevationData[i][0]) {
                distance += elevationData[i][0];
            }
            indices[i] = elevationData[i][2];
        }
        return {data: elevations, labels, indices};
    }

    onRouteClick(routeIndex) {
        if (this.props.chooseRoute) {
            this.props.chooseRoute(routeIndex);
        }
    }

    renderOtherRouteOptions() {
        const components = [];
        const routes = this.props.allRoutes;
        const rand = Math.random().toString(36).substring(4);
        for (let i = 0; i < routes.length; i++) {
            if (i === this.props.selectedRoute) continue;

            const key = `route-${rand}-i`;
            components.push(<span>
                <a key={key} onClick={() => this.onRouteClick(i)}>Another route #{i}</a>,&nbsp;
            </span>);
        }

        return components;
    }

    renderPois() {
        const route = this.props.allRoutes[this.props.selectedRoute];
        const pois = route.pois;

        const components = [];
        for (const poi of pois) {
            const key = `${route.id}${Math.random()}`;
            const poiType = PoiTypes[poi.type];

            let typeName = poiType ? poiType.displayName : null;
            if (!typeName) typeName = poi.type.replace(/^\w/, c => c.toUpperCase());

            let iconName = poiType ? poiType.icon : null;
            if (!iconName) iconName = 'star';

            components.push(
                <div key={key} className="timeline-item ariadne-timeline-item">
                    <div className="timeline-marker is-image is-32x32 has-text-centered">
                        <Icon icon={iconName}/>
                    </div>
                    <div className="timeline-content">
                        <p className="heading">{typeName}</p>
                        <p>{poi.name}</p>
                    </div>
                </div>
            );
        }
        return components;
    }

    render() {
        let currentRouteIndex = this.props.selectedRoute;
        if (currentRouteIndex === null || currentRouteIndex === undefined) {
            currentRouteIndex = 0;
        }
        const currentRouteData = this.props.allRoutes[currentRouteIndex];

        return (
            <div ref={this.containerRef} style={{minWidth: '100%', position: 'relative'}}>
                <div className="card" style={{overflowY: 'scroll', maxHeight: 'calc(100vh - 100px)', position: 'relative'}}>
                    <div className="card-content">
                        <h1 className="title is-size-4">Here's a route we prepared for you:</h1>
                        {this.props.allRoutes.length > 1 &&
                        <p>There are also some other options: {this.renderOtherRouteOptions()}</p>
                        }

                        <hr/>
                        <h2 className="is-size-6">&nbsp;&nbsp;&nbsp;&nbsp;Elevation profile:</h2>
                        <br/>
                        <ElevationView elevationData={this.getElevationData(currentRouteData)}
                                       highlightRouteUntil={this.props.highlightRouteUntil}/>
                        <hr style={{marginBottom: 0}}/>

                        <table className="table is-fullwidth is-marginless">
                            <tbody>
                            <tr>
                                <td>Length:</td>
                                <td>{Math.round(currentRouteData.length)} m</td>
                            </tr>
                            {/* TODO: Show this when greenery/rating score is up. */}
                            {/*<tr>*/}
                            {/*<td>Greenery rating:</td>*/}
                            {/*<td className="has-text-success">97%</td>*/}
                            {/*</tr>*/}
                            <tr>
                                <td>Time (approx.):</td>
                                <td>{Math.round(currentRouteData.length / 160.0)} minute(s)</td>
                            </tr>
                            </tbody>
                        </table>

                        {currentRouteData.pois.length > 0 &&
                        <div>
                            <br/>
                            <div className="timeline">
                                <header className="timeline-header">
                                    <span className="tag is-medium is-primary">Start</span>
                                </header>
                                {this.renderPois()}
                                <div className="timeline-header">
                                    <span className="tag is-medium is-primary">Finish</span>
                                </div>
                            </div>
                        </div>
                        }
                        <br/>
                        <IconButton icon="arrow-left" onClick={this.props.showPreferenceEditor}>Back to
                            preferences</IconButton>
                    </div>
                </div>
            </div>
        );
    }
}
