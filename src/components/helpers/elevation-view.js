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
        elevationData: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        this.blueColor = '#279aec';
        this.blueColorTransparent = `${this.blueColor}80`;
        this.elevationData = this.props.elevationData ? this.props.elevationData.data : null;
        this.labels = this.props.elevationData ? this.props.elevationData.labels : null;
    }

    componentDidMount() {
        if (this.elevationData && this.elevationData.length > 0) {
            console.log(this.elevationData.length)
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
    }

    render() {
        return (
            <div>
                <canvas ref="myChart"/>
            </div>
        );
    }
}

