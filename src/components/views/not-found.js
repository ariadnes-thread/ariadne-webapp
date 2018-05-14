/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import Icon from '@fortawesome/react-fontawesome';
import {Link} from 'react-router-dom';

import React, {Component} from 'react';
import Card from '../helpers/card';

export default class NotFound extends Component {

    render() {
        return (
            <div>
                <section className="hero is-info">
                    <div className="hero-body container">
                        <div className="container columns is-vcentered">
                            <div className="column is-narrow has-text-right">
                                <Icon className="icon is-large is-size-1" icon="exclamation-triangle"/>
                            </div>
                            <div className="column">
                                <h1 className="title is-size-1">Error 404 - Page Not Found</h1>
                                <h2 className="subtitle">
                                    The page you requested either never existed or has been moved.
                                </h2>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container">
                    <br/>
                    <div className="columns is-centered">
                        <div className="column is-one-third">
                            <Card>
                                <p>We can't find the page you requested.
            Perhaps you made a typo in the page address or it has never existed
            in the first place. <Link to="/">Click here to go to home page.</Link></p>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
