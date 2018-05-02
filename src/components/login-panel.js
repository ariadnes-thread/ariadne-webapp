/**
 * @author Mary Giambrone
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Promise from 'bluebird';
import Auth from '../util/auth';
import Icon from '@fortawesome/react-fontawesome';
// import 'font-awesome/css/font-awesome.min.css';

export default class LoginPanel extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            email:"",
            password:""
        };
        console.log("On entry to login panel, are we authenticated? " + this.props.auth.isAuthenticated());

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
                return this.props.auth.doLogin(this.state);
            }).then(() => {
                // TODO: do not redirect until it is a successful login
                this.props.history.push('/route');
            }
        )
            .catch(error => {
                console.error(JSON.stringify(error, null, 2));
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
                                <form onSubmit={this.handleSubmit}>
                                    <div className="field has-text-left">
                                        <label className="label">Email</label>
                                        <div className="control has-icons-left has-icons-right">
                                            <input className="input"
                                                   type="email"
                                                   name="email"
                                                   onChange={this.handleChange}
                                                   placeholder="test@test.com"/>
                                            <span className="icon is-small is-left">
                                                <Icon icon="envelope"/>
                                            </span>
                                        </div>
                                        {/*<p className="help is-danger">This email is invalid</p>*/}
                                    </div>
                                    <div className="field has-text-left">
                                        <label className="label">Password</label>
                                        <div className="control has-icons-left has-icons-right">
                                            <input className="input"
                                                   type="password"
                                                   name="password"
                                                   onChange={this.handleChange}
                                                   placeholder="**********"/>
                                            <span className="icon is-small is-left">
                                                <Icon icon="key"/>
                                            </span>
                                        </div>
                                    </div>
                                    <button className="button is-primary">Login</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
