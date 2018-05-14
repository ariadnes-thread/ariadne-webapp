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
        this.mapClickHandler = null;

        this.submitPreferences = this.submitPreferences.bind(this);
        this.showPreferenceEditor = this.showPreferenceEditor.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.requestNextMapClick = this.requestNextMapClick.bind(this);
        this.cancelMapClickHandler = this.requestNextMapClick.bind(this);
    }

    submitPreferences(prefState) {
        return Promise.resolve()
            .then(() => this.generateRoute(prefState));
    }

    generateRoute(prefState) {
        const constraints =  prefState.getPrefsFormattedForApi();
        Util.logDebug('Sending route planning request to API. Constraints:', constraints);
        const apiRequestPromise = Promise.resolve()
            .then(() => this.api.planningModule.planRoute({constraints}));

        // Separate promise chain
        apiRequestPromise
            .then(routesResponse =>
                // This syntax is intentional - creating a separate promise chain.
                Promise.resolve()
                    .then(() => this.visualizeRoutes(routesResponse.routes))
                    .catch(error => Util.logError({
                        error,
                        message: `Error occurred while calling 'visualizeRoute()'!`,
                    }))
            );

        // Note that we return a promise *without* the last visualizeRoutes() part - this is so the
        return apiRequestPromise;
    }

    visualizeRoutes(routes) {
        const firstRoute = routes[0];
        this.setState({
            geoJsonObjects: [JSON.parse(firstRoute.json)],
            displayMode: DisplayMode.RouteSelector,
            routeData: firstRoute,
        });
    }

    /**
     * @param {object} data
     * @param {string} [data.message] Text that will be displayed on the map
     * to tell the user what their next click will do.
     */
    requestNextMapClick(data) {
        return Promise.resolve()
            .then(() => {
                if (this.mapClickHandler) {
                    // Previous handler got interrupted, and we tell it by passing `false`.
                    this.mapClickHandler(false);
                }

                this.setState({
                    mapClickMessage: data ? data.message : null,
                });

                return new Promise(resolve => {
                    this.mapClickHandler = resolve;
                });
            });
    }

    cancelMapClickHandler() {
        if (this.mapClickHandler) {
            // Previous handler got interrupted, and we tell it by passing `false`.
            this.mapClickHandler(false);
            this.mapClickHandler = null;
        }
        this.setState({
            mapClickMessage: null,
        });
    }

    /**
     * Routes the map click to the right listener. The supplied even object
     * is the Leaflet map click event.
     */
    handleMapClick(event) {
        if (this.mapClickHandler) {
            this.mapClickHandler(event);
            this.mapClickHandler = null;
        }

        this.setState({mapClickMessage: null});
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
                            <div className="card-content is-paddingless leaflet-container-wrapper">
                                <Map auth={this.props.auth}
                                     geoJsonObjects={this.state.geoJsonObjects}
                                     onMapClick={this.handleMapClick}
                                     clickMessage={this.state.mapClickMessage}
                                     onMapClickCancel={this.cancelMapClickHandler}/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
