/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import PreferenceEditor from '../helpers/preference-editor';
import MapWithRoutes from '../helpers/map/map-with-routes';
import Auth from '../../util/auth';

export default class RouteCustomizer extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            geometry: null,
        };

        this.api = this.props.auth.api;
        this.submitPreferences = this.submitPreferences.bind(this);
        this.generateRoute = this.generateRoute.bind(this);
    }

    submitPreferences(prefState) {
        console.log(prefState.preferences);
    }

    generateRoute(prefState) {
        console.log(prefState.preferences);
        Promise.resolve()
            .then(() => this.api.planningModule.planRoute({constraints: prefState.getPrefsFormattedForApi()}))
            .then(routeData => this.visualizeRoute(routeData))

            // TODO: Parse API Error
            .catch(error => console.log('Whoops!'));
    }

    visualizeRoute(routeData) {
        this.setState({
            geometry: routeData.route,
        });
    }

    render() {
        return (
            <section className="section ariadne-section-uniform-padding">
                <div className="columns is-centered is-multiline">
                    <div className="column is-one-third-desktop is-12-tablet is-12-mobile">
                        <PreferenceEditor submitPreferences={this.submitPreferences}/>
                    </div>
                    <div className="column is-two-thirds-desktop is-12-tablet is-12-mobile">
                        <div className="card">
                            <div className="card-content is-paddingless">
                                <MapWithRoutes auth={this.props.auth} geometry={this.state.geometry}/>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        );
    }
}
