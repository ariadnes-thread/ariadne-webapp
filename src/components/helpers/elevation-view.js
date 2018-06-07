/**
 * @author Mary Giambrone
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';


function debounce(fn, delay) {
    let timer = null;
    return function (/*arguments*/) {
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(null, args);
        }, delay);
    };
}


export default class ElevationView extends Component {

    static propTypes = {
        elevationData: PropTypes.object,
        highlightRouteUntil: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.blueColor = '#279aec';
        this.blueColorTransparent = `${this.blueColor}80`;
        this.elevationData = this.props.elevationData ? this.props.elevationData.data : null;
        this.labels = this.props.elevationData ? this.props.elevationData.labels : null;
        this.indices = this.props.elevationData ? this.props.elevationData.indices : null;

        this.onPointHover = debounce(this.onPointHover.bind(this), 10);
    }

    onPointHover(element) {
        const routeIndex = this.indices[element._index];
        this.props.highlightRouteUntil(routeIndex);
    }

    componentDidMount() {
        if (!this.elevationData || this.elevationData.length === 0) return;

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
                events: ['mousemove'],
                onHover: (data, elements) => {
                    if (elements.length < 1) return;
                    this.onPointHover(elements[0]);
                },
                hover: {
                    mode: 'index',
                    intersect: false,
                },

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
                    mode: 'index',
                    intersect: false,
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

