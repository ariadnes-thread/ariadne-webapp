/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @author Mary Giambrone
 * @copyright 2018
 * @license GPL-3.0
 */

import Icon from '@fortawesome/react-fontawesome';
import {NavLink} from 'react-router-dom';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';

import Auth from '../../util/auth';

export default class Navbar extends Component {

    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

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
        this.loginButtonAction = this.loginButtonAction.bind(this);
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

    loginButtonAction() {
        this.buttonClick();
        if (this.props.auth.isAuthenticated()) {
            swal({
                title: 'Log Out',
                text: 'Do you want to continue?',
                type: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, Logout',

            }).then((result) => {
                console.log('Logging out...');
                this.props.auth.handleLogout();
            });
        }
        else {
            this.context.router.history.push('/login');
        }
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
                                                 to="/plan-route" onClick={this.buttonClick}>
                                        <span className="icon">
                                            <Icon icon="code-branch"/>
                                        </span>
                                            <span>Plan a route</span>
                                        </NavLink>
                                    </p>
                                    {/*<p className="control">*/}
                                    {/*<NavLink className="button is-info" activeClassName="is-active"*/}
                                    {/*to="/saved" onClick={this.buttonClick}>*/}
                                    {/*<span className="icon">*/}
                                    {/*<Icon icon="star"/>*/}
                                    {/*</span>*/}
                                    {/*<span>Saved Routes</span>*/}
                                    {/*</NavLink>*/}
                                    {/*</p>*/}
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

                                        <a className="button is-info" onClick={this.loginButtonAction}>
                                            <span className="icon"><Icon icon="sign-out-alt"/></span>
                                            <span>{[this.props.auth.isAuthenticated()]
                                                ? 'Logout'
                                                : 'Sign in'}</span>
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
