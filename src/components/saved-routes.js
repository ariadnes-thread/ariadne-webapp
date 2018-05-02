/**
 * @author Mary Giambrone
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import Promise from 'bluebird';
// import swal from 'sweetalert2'
// import MapWithRoutes from './map-with-routes';
import Auth from '../util/auth';


export default class SavedRoutes extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
    };

    constructor(props) {
        super(props);

        console.log("On entry to saved routes page, are we authenticated? " + this.props.auth.isAuthenticated());

    }

    render() {
        return (
            <section className="section ariadne-section-uniform-padding">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="card">
                            <div className="card-content has-text-centered">
                                <p>TODO: saved routes :)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
