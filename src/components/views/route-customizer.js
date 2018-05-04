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

        this.api = this.props.auth.api;

        this.generateRoute = this.generateRoute.bind(this);
    }

    generateRoute(prefState) {
        Promise.resolve()
            .then(() => this.api.planningModule.planRoute({constraints: prefState.getPrefsFormattedForApi()}))
            .then(route => console.log(route))
            .catch(error => console.log('Whoops!'));
    }

    visualizeRoute(prefState) {
    }

    render() {
        return (
            <section className="section ariadne-section-uniform-padding">
                <div className="columns is-centered">
                    <div className="column is-one-third">
                        <PreferenceEditor generateRoute={this.generateRoute}/>
                    </div>
                    <div className="column">
                        <div className="card">
                            <div className="card-content is-paddingless">
                                <MapWithRoutes auth={this.props.auth}/>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        );
    }
}
