/**
 * @author Mary Giambrone
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';

export default class ElevationView extends Component {

    static propTypes = {
        elevationData: PropTypes.array.isRequired,
        distance: PropTypes.number.isRequired,
    };

    constructor(props) {
        super(props);

        this.blueColor = '#279aec';
        this.blueColorTransparent = `${this.blueColor}80`;
        // TODO: get a series of elevations and the overall route distance passed in from
        // the route planner
        this.elevationData = this.props.elevationData;
        this.distance = this.props.distance;
        this.labels = this.elevationData.map((val, index) => (index * this.distance / this.elevationData.length).toFixed(2));
    }

    componentDidMount() {
        this.chart = new Chart(this.refs.myChart.getContext('2d'), {
            type: 'line',
            data: {
                labels: this.labels,
                datasets: [{
                    label: 'Elevation',
                    borderColor: this.blueColor,
                    backgroundColor: this.blueColorTransparent,
                    data: this.elevationData,
                    fill: true,
                }],
            },
            options: {
                responsive: true,
                legend: {
                    display: false,
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {display: true, labelString: 'Elevation (ft)', fontStyle: 'bold'},
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Distance along route (mi)',
                            fontStyle: 'bold',
                        },
                        ticks: {
                            maxTicksLimit: 6,
                        },
                    }],
                },
                tooltips: {
                    displayColors: false,
                    callbacks: {
                        title: () => '',
                        label: (tooltipItem) => `${tooltipItem.yLabel} ft`,
                    },
                },
            },
        });
    }

    render() {
        return (
            <div>
                <canvas ref="myChart"/>
            </div>
        );
    }
}

