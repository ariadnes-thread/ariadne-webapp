/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import TransitionGroup from 'react-addons-transition-group';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Promise from 'bluebird';

import PreferenceEditor from '../helpers/preference-editor';
import RouteSelector from '../helpers/route-selector';
import Auth from '../../util/auth';
import Util from '../../util/util';
import Map from '../helpers/map';

const DisplayMode = {
    PreferenceEditor: 'editor',
    RouteSelector: 'selector',
};

export default class RouteCustomizer extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            geoJsonObjects: [],
            displayMode: DisplayMode.PreferenceEditor,
            routeData: null,
            mapClickMessage: null,
        };
        this.api = this.props.auth.api;
        this.mapClickHandlers = [];

        this.submitPreferences = this.submitPreferences.bind(this);
        this.showPreferenceEditor = this.showPreferenceEditor.bind(this);
        this.routeMapClick = this.routeMapClick.bind(this);
        this.requestNextMapClick = this.requestNextMapClick.bind(this);
    }

    submitPreferences(prefState) {
        return Promise.resolve()
            .then(() => this.generateRoute(prefState));
    }

    generateRoute(prefState) {
        const apiRequestPromise = Promise.resolve()
            .then(() => this.api.planningModule.planRoute({constraints: prefState.getPrefsFormattedForApi()}));

        // Separate promise chain
        apiRequestPromise
            .then(routeData => this.visualizeRoute(routeData))
            .catch(error => Util.logError({
                error,
                message: `Error occurred while calling 'visualizeRoute()' - this was not supposed to happen.`,
            }));

        // Note that we return a promise *without* the last visualizeRoute() part - this is so the
        return apiRequestPromise;
    }

    visualizeRoute(routeData) {
        this.setState({
            geoJsonObjects: [routeData.route],
            displayMode: DisplayMode.RouteSelector,
            routeData,
        });
    }

    /**
     * @param {object} data
     * @param {string} [data.message] Text that will be displayed on the map
     * to tell the user what their next click will do.
     */
    requestNextMapClick(data) {
        this.setState({
            mapClickMessage: data.message,
        });

        return Promise.resolve()
            .then(() => {
                
            });
        alert('Route Customizer reached!');
    }

    /**
     * Routes the map click to the right listener. The supplied even object
     * is the Leaflet map click event.
     */
    routeMapClick(event) {
        console.log(event);
    }

    showPreferenceEditor() {
        this.setState({
            displayMode: DisplayMode.PreferenceEditor,
        });
    }

    render() {
        return (
            <section className="section ariadne-section-uniform-padding" style={{height: '100%'}}>
                <div className="columns is-centered is-multiline" style={{height: '100%'}}>
                    <div className="column is-one-third-desktop is-12-tablet is-12-mobile">
                        <div style={{position: 'relative', boxSizing: 'border-box'}}>
                            <TransitionGroup>
                                {this.state.displayMode === DisplayMode.PreferenceEditor &&
                                <PreferenceEditor submitPreferences={this.submitPreferences}
                                                  requestNextMapClick={this.requestNextMapClick}/>}

                                {this.state.displayMode === DisplayMode.RouteSelector &&
                                <RouteSelector routeData={this.state.routeData}
                                               showPreferenceEditor={this.showPreferenceEditor}/>}
                            </TransitionGroup>
                        </div>
                    </div>

                    <div className="column is-two-thirds-desktop is-12-tablet is-12-mobile" style={{height: '100%'}}>
                        <div className="card" style={{height: '100%'}}>
                            <div className="card-content is-paddingless leaflet-container-wrapper"
                                 style={{height: '100%'}}>
                                 <Map auth={this.props.auth}
                                      geoJsonObjects={this.state.geoJsonObjects}
                                      onMapClick={this.routeMapClick}
                                      clickMessage={this.state.mapClickMessage}/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
