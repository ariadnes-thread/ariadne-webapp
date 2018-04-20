/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import Icon from '@fortawesome/react-fontawesome';
import {NavLink} from 'react-router-dom';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import LoginPanel from './login-panel';

import Auth from '../util/auth';

export default class Navbar extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            burgerMenuActive: false,
        };

        this.rootHtmlElement = document.getElementsByTagName('html').item(0);
        this.toggleBurgerMenu = this.toggleBurgerMenu.bind(this);
        this.buttonClick = this.buttonClick.bind(this);
        this.tableFlip = this.tableFlip.bind(this);
    }

    componentDidMount() {
        // Add the relevant class to <html> tag. Needed for correct Bulma fixed navbar styling.
        this.rootHtmlElement.classList.add('has-navbar-fixed-top');
    }

    componentWillUnmount() {
        this.rootHtmlElement.classList.remove('has-navbar-fixed-top');
    }

    toggleBurgerMenu() {
        this.setState({burgerMenuActive: !this.state.burgerMenuActive});
    }

    buttonClick() {
        this.setState({burgerMenuActive: false});
    }

    tableFlip() {
        this.buttonClick();
        alert('(╯°□°)╯︵ ┻━┻ ');
    }

    render() {
        const navbarMenuClass = this.state.burgerMenuActive ? 'navbar-menu is-active' : 'navbar-menu';
        return (
            <nav className="navbar is-info is-fixed-top" aria-label="main navigation">
                <div className="container">
                    <div className="navbar-brand">
                        <a className="navbar-item" href={this.props.auth.config.baseUri}>
                            Ariadne's Thread
                        </a>

                        <div className="navbar-burger" onClick={this.toggleBurgerMenu}>
                            <span/>
                            <span/>
                            <span/>
                        </div>
                    </div>

                    <div className={navbarMenuClass}>
                        <div className="navbar-start">
                            <div className="navbar-item">
                                <div className="field is-grouped">
                                    <p className="control">
                                        <NavLink className="button is-info" activeClassName="is-active"
                                                 exact to="/" onClick={this.buttonClick}>
                                        <span className="icon">
                                            <Icon icon="home"/>
                                        </span>
                                            <span>Home</span>
                                        </NavLink>
                                    </p>
                                    <p className="control">
                                        <NavLink className="button is-info" activeClassName="is-active"
                                                 to="/debug" onClick={this.buttonClick}>
                                        <span className="icon">
                                            <Icon icon="magic"/>
                                        </span>
                                            <span>Debug</span>
                                        </NavLink>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="navbar-end">
                            <div className="navbar-item">
                                <div className="field is-grouped">
	                                <p className="control">
                                        <NavLink className="button is-info" activeClassName="is-active"
                                                 to="/login">
                                            <span className="icon"><Icon icon="exclamation-circle"/></span>
                                            <span>Login</span>
                                        </NavLink>
                                    </p>
                                    <p className="control">
                                        <a className="button is-info" onClick={this.tableFlip}>
                                            <span className="icon"><Icon icon="exclamation-circle"/></span>
                                            <span>Don't click me</span>
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </nav>
        );
    }

}
