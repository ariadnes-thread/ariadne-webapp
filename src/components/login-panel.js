/**
 * @author Mary Giambrone
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Promise from 'bluebird';

import MapWithRoutes from './map-with-routes';
import Auth from '../util/auth';


export default class LoginPanel extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            username:"",
            password:""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        event.preventDefault();
        this.setState({[event.target.name] : event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        Promise.resolve()
            .then(() => {
                console.log(this.state);
                return this.props.auth.authenticateStaff(this.state);
            }).then((res) => {console.log(res);})
            .catch(error => {
                console.error(error);
                // TODO: Replace with user-friendly warning/modal
                alert('Error occurred during form submission. Check console.');
            });
    }

    render() {
        return (
            <section className="section ariadne-section-uniform-padding">
                <div className="container">
                    <div className="columns is-centered">
                            <div className="card">
                                <div className="card-content has-text-centered">
                                    <p>Login below.</p>
                                    <hr/>
                                    <form onSubmit={this.handleSubmit}>
                                        Username: <input type="text" name="username" onChange={this.handleChange}/>
                                        <br/>
                                        Password: <input type="text" name="password" onChange={this.handleChange}/>
                                        <hr/>
                                        <button className="button is-info">Login</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
            </section>
        );
    }
}
