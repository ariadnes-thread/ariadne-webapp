/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';

export default class StartupError extends Component {
    render() {
        return (
            <section className="section">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-one-third">
                            <article className="message is-danger">
                                <div className="message-header">
                                    <p>TrekStar webapp startup error</p>
                                </div>
                                <div className="message-body has-text-left">
                                    An error has occurred during loading. This is an issue with the
                                    web application itself - please report it to the TrekStar team.
                                    Check developer console for details.
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
