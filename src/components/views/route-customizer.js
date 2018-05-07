/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import PreferenceEditor from '../helpers/preference-editor';
import Auth from '../../util/auth';
import Map from '../helpers/map';

export default class RouteCustomizer extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            geoJsonObjects: [],
        };

        this.api = this.props.auth.api;
        this.submitPreferences = this.submitPreferences.bind(this);
        this.generateRoute = this.generateRoute.bind(this);
    }

    submitPreferences(prefState) {
        console.log(prefState.getPrefsFormattedForApi());
        this.generateRoute(prefState);
    }

    generateRoute(prefState) {
        Promise.resolve()
            .then(() => this.api.planningModule.planRoute({constraints: prefState.getPrefsFormattedForApi()}))
            .then(routeData => this.visualizeRoute(routeData))

            // TODO: Parse API Error
            .catch(error => console.log('Whoops!'));
    }

    visualizeRoute(routeData) {
        this.setState({
            geoJsonObjects: [routeData.route],
        });
    }

    render() {
        return (
            <section className="section ariadne-section-uniform-padding" style={{height: '100%'}}>
                <div className="columns is-centered is-multiline" style={{height: '100%'}}>
                    <div className="column is-one-third-desktop is-12-tablet is-12-mobile">
                        <PreferenceEditor submitPreferences={this.submitPreferences}/>
                    </div>

                    <div className="column is-two-thirds-desktop is-12-tablet is-12-mobile" style={{height: '100%'}}>
                        <div className="card" style={{height: '100%'}}>
                            <div className="card-content is-paddingless leaflet-container-wrapper"
                                 style={{height: '100%'}}>
                                <Map auth={this.props.auth} geoJsonObjects={this.state.geoJsonObjects} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
