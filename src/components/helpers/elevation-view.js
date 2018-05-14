/**
 * @author Mary Giambrone
 * @copyright 2018
 * @license GPL-3.0
 */

import Icon from '@fortawesome/react-fontawesome';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TweenMax} from 'gsap';
import Chart from 'chart.js';

import Card from './card';
import IconButton from './icon-button';

export default class ElevationView extends Component {

    static propTypes = {
        elevationData: PropTypes.object.isRequired,
        distance: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.blueColor = "#279aec";
        this.blueColorTransparent = this.blueColor + "80";
        // TODO: get a series of elevations and the overall route distance passed in from
        // the route planner
        this.elevationData = this.props.elevationData
        this.distance = this.props.distance
        this.labels = this.elevationData.map((val, index) => (index * this.distance / this.elevationData.length).toFixed(2));
    }

    componentDidMount() {
        console.log(this.refs);
        this.chart = new Chart(this.refs.myChart.getContext("2d"), {
            type: 'line',
            data: {
                labels: this.labels,
                datasets: [{
                    label: 'Elevation',
                    borderColor: this.blueColor,
                    backgroundColor: this.blueColorTransparent,
                    data: this.elevationData,
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                legend: {
                    display: false,
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {display: true, labelString: "Elevation (ft)", fontStyle:"bold"}
                    }],
                    xAxes:  [{
                        scaleLabel: {
                            display: true,
                            labelString: "Distance along route (mi)",
                            fontStyle:"bold",
                        },
                        ticks: {
                            maxTicksLimit: 6,
                        }
                    }],
                },
                tooltips: {
                    displayColors: false,
                    callbacks: {
                        title: () => {
                            return "";
                        },
                        label: (tooltipItem) => {
                            return tooltipItem.yLabel + " ft";
                        }
                    }
                }
            }
        });
    }

    render() {
        return (
            <div>
                <canvas ref="myChart"></canvas>
            </div>
        );
    }
}

