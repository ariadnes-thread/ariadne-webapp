/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Icon from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

import Auth from '../util/auth';

export default class Navbar extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
    };

    constructor(props) {
        super(props);

        this.rootHtmlElement = document.getElementsByTagName('html').item(0);
    }

    componentDidMount() {
        // Add the relevant class to <html> tag. Needed for correct Bulma fixed navbar styling.
        this.rootHtmlElement.classList.add('has-navbar-fixed-top');
    }

    componentWillUnmount() {
        this.rootHtmlElement.classList.remove('has-navbar-fixed-top');
    }

    static tableFlip() {
        alert('(╯°□°)╯︵ ┻━┻ ');
    }

    render() {
        return (
            <nav className="navbar is-info is-fixed-top" aria-label="main navigation">
                <div className="container">
                    <div className="navbar-brand">
                        <a className="navbar-item" href={this.props.auth.baseUrl}>
                            Ariadne's Thread
                        </a>

                        <div className="navbar-burger">
                            <span/>
                            <span/>
                            <span/>
                        </div>
                    </div>

                    <div className="navbar-start">
                        <div className="navbar-item">
                            <div className="field is-grouped">
                                <p className="control">
                                    <Link className="button is-info" to="/">
                                        <span className="icon">
                                            <Icon icon="home"/>
                                        </span>
                                        <span>Home</span>
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="field is-grouped">
                                <p className="control">
                                    <a className="button is-info" onClick={Navbar.tableFlip}>
                                        <span className="icon">
                                            <Icon icon="exclamation-circle"/>
                                        </span>
                                        <span>Don't click me</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </nav>
        );
    }

}
