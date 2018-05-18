/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import Icon from '@fortawesome/react-fontawesome';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TweenMax} from 'gsap';

import Card from './card';
import IconButton from './icon-button';
import ElevationView from './elevation-view';

export default class RouteSelector extends Component {

    static propTypes = {
        routeData: PropTypes.object.isRequired,
        showPreferenceEditor: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.containerRef = React.createRef();
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


    // TODO: interface with API (in elevation_utils.py) to get route distance and elevation
    getElevationData() {
        let distance = 0;
        let elevations = [];
        let labels = [];
        for (let i = 0; i < this.props.routeData.elevationData.length; i++)
        {
            elevations.push((this.props.routeData.elevationData[i][1]).toFixed(2));
            labels.push((distance/5280).toFixed(2));
            distance += this.props.routeData.elevationData[i][0]
        }
        return {data: elevations, labels: labels}
    }

    render() {
        return (
            <div ref={this.containerRef} style={{minWidth: '100%'}}>
                <Card>
                    <h1 className="title is-size-4">Here's a route we prepared for you:</h1>
                    <div className="columns">
                        <div className="column">
                            <table className="table is-fullwidth">
                                <tbody>
                                <tr>
                                    <td>Length:</td>
                                    <td>{Math.round(this.props.routeData.length)} m</td>
                                </tr>
                                <tr>
                                    <td>Greenery rating:</td>
                                    <td className="has-text-success">97%</td>
                                </tr>
                                <tr>
                                    <td>Time (approx.):</td>
                                    <td>2 hours</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="column">
                            <div className="timeline is-centered">
                                <header className="timeline-header">
                                    <span className="tag is-medium is-primary">Start</span>
                                </header>
                                <div className="timeline-item ariadne-timeline-item">
                                    <div className="timeline-marker is-image is-32x32 has-text-centered">
                                        <Icon icon="leaf"/>
                                    </div>
                                    <div className="timeline-content">
                                        <p className="heading">Park</p>
                                        <p>Villa Park</p>
                                    </div>
                                </div>
                                <div className="timeline-item ariadne-timeline-item">
                                    <div className="timeline-marker is-image is-32x32 has-text-centered">
                                        <Icon icon="utensils"/>
                                    </div>
                                    <div className="timeline-content">
                                        <p className="heading">Restaurant</p>
                                        <p>Zankou Chicken</p>
                                    </div>
                                </div>
                                <div className="timeline-header">
                                    <span className="tag is-medium is-primary">Finish</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <ElevationView elevationData={this.getElevationData()}/>
                    </div>
                    <IconButton icon="arrow-left" onClick={this.props.showPreferenceEditor}>Back to
                        preferences</IconButton>
                </Card>
            </div>
        );
    }
}
