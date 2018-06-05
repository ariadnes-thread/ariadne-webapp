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
import PreferencesState from '../../util/preferences-state';
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
            mapClickMessage: null,
            allRoutes: [],
            selectedRoute: null,
            highlightUntilIndex: null,
        };
        this.api = this.props.auth.api;
        this.mapClickHandler = null;

        // Check if prefState was provided through a `react-router` link (e.g. from Home page). If not, init new state.
        if (this.props.location.initialPrefState) {
           this.prefState = this.props.location.initialPrefState;
           Util.logDebug('Found prefState passed via react-router link, using it!');
        } else {
            this.prefState = new PreferencesState();
        }

        this.submitPreferences = this.submitPreferences.bind(this);
        this.showPreferenceEditor = this.showPreferenceEditor.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.requestNextMapClick = this.requestNextMapClick.bind(this);
        this.cancelMapClickHandler = this.requestNextMapClick.bind(this);
        this.highlightRouteUntil = this.highlightRouteUntil.bind(this);
        this.chooseRoute = this.chooseRoute.bind(this);
    }

    submitPreferences(prefState) {
        return Promise.resolve()
            .then(() => this.generateRoute(prefState));
    }

    generateRoute(prefState) {
        const constraints =  prefState.getPrefsFormattedForApi();
        Util.logDebug('Submitting constraints to API for route planning:', constraints);
        const apiRequestPromise = Promise.resolve()
            .then(() => this.api.planningModule.planRoute({constraints}));

        // Separate promise chain
        apiRequestPromise
            .catch(() => false) // This error is handled elsewhere
            .then(routesResponse => {
                if (routesResponse === false) return;
                // This syntax is intentional - creating a separate promise chain.
                Promise.resolve()
                    .then(() => this.visualizeRoutes(routesResponse))
                    .catch(error => Util.showErrorModal({
                        message: 'An error occurred while visualizing your route.',
                        console: error,
                    }));
            });

        // Note that we return a promise *without* the last visualizeRoutes() part - this is so the
        return apiRequestPromise;
    }

    visualizeRoutes(routesResponse) {
        // At the moment, the API only returns a single route, but we can support more - just concatenate all of them
        // into an array.
        const singleRoute = routesResponse.routes;
        const allRoutes = [singleRoute];

        this.setState({
            allRoutes: allRoutes,
            highlightUntilIndex: null,
        });
        this.chooseRoute(0);
    }

    chooseRoute(routeIndex) {
        if (routeIndex >= this.state.allRoutes.length) {
            Util.logError('Invalid route index specified in `chooseRoute()`!');
            return;
        }

        const route = this.state.allRoutes[routeIndex];
        this.setState({
            displayMode: DisplayMode.RouteSelector,
            geoJsonObjects: [route.geojson],
            selectedRoute: routeIndex,
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

    /**
     * Highlights route up until the node with the specified index.
     * @param {int} index
     */
    highlightRouteUntil(index) {
        this.setState({
            highlightUntilIndex: index,
        });
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
                                                  requestNextMapClick={this.requestNextMapClick}
                                                  prefState={this.prefState}/>}

                                {this.state.displayMode === DisplayMode.RouteSelector &&
                                <RouteSelector allRoutes={this.state.allRoutes}
                                               selectedRoute={this.state.selectedRoute}
                                               chooseRoute={this.chooseRoute}
                                               highlightRouteUntil={this.highlightRouteUntil}
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
                                     onMapClickCancel={this.cancelMapClickHandler}
                                     highlightUntilIndex={this.state.highlightUntilIndex}
                                     prefState={this.prefState}/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
