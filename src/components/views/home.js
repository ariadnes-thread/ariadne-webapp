/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import Icon from '@fortawesome/react-fontawesome';
import {Link} from 'react-router-dom';

import IconButton from '../helpers/icon-button';
import React, {Component} from 'react';
import Card from '../helpers/card';

export default class Home extends Component {

    renderDummyCheckboxes() {
        const checkboxItems = ['Parks', 'Restaurants', 'Bars', 'Coffee shops', 'Shopping malls', 'Gyms'];
        const components = new Array(checkboxItems.length);
        for (let i = 0, k = 0; i < checkboxItems.length; i++, k++) {
            const item = checkboxItems[i];
            const key = `home-${i}-checkbox`;
            const label = item.replace(' ', '');
            components[k] = <div key={key} className="control">
                <input className="is-checkradio is-medium" id={label} type="checkbox" onChange={() => null}/>
                <label htmlFor={label}>{item}</label>
            </div>;
        }

        return <div className="field is-grouped is-grouped-multiline is-grouped-right">{components}</div>;
    }

    render() {
        return (
            <div>
                <section className="hero is-info">
                    <div className="hero-body container">
                        <div className="container columns is-vcentered">
                            <div className="column is-narrow has-text-right">
                                <Icon className="icon is-large is-size-1" icon="child"/>
                            </div>
                            <div className="column">
                                <h1 className="title is-size-1">Welcome to TrekStar Route planner!</h1>
                                <h2 className="subtitle">
                                    Plan a perfect route to discover a new city, work out or just enjoy your time.
                                </h2>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container">
                    <br/>
                    <div className="columns">
                        <div className="column is-one-fifth">
                            <Card>
                                <div className="field">
                                    <label className="label">Email</label>
                                    <div className="control">
                                        <input className="input" type="text" placeholder="john@example.com"/>
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Password</label>
                                    <div className="control">
                                        <input className="input" type="password" placeholder="*******"/>
                                    </div>
                                </div>
                                <p className="link has-text-centered">Don't have an account?</p>
                            </Card>
                        </div>
                        <div className="column">
                            <Card>
                                <h1 className="title has-text-grey">Let's start planning your perfect route.</h1>
                                <hr/>

                                <nav className="level">
                                    <div className="level-item level-left">
                                        <p className="title is-size-4">
                                            <span className="tag is-warning is-rounded is-large">Step 1</span>
                                            &nbsp;&nbsp;<span>What neighbourhood do you want to explore?</span>
                                        </p>
                                    </div>
                                    <div className="level-item level-right">
                                        <div className="field">
                                            <div className="control">
                                                <input className="input is-large is-info" type="text"
                                                       placeholder="City, postcode, address"/>
                                            </div>
                                        </div>
                                    </div>
                                </nav>
                                <hr/>

                                <nav className="level">
                                    <div className="level-item level-left">
                                        <p className="title is-size-4">
                                            <span className="tag is-warning is-rounded is-large">Step 2</span>
                                            &nbsp;&nbsp;<span>What do you want to do?</span>
                                        </p>
                                    </div>
                                    <div className="level-item level-right">
                                        <div className="buttons has-addons">
                                            <IconButton icon="male" size="large">Walk</IconButton>
                                            <IconButton icon="child" size="large" type="info" active>Run</IconButton>
                                            <IconButton icon="bicycle" size="large">&nbsp;Cycle</IconButton>
                                        </div>
                                    </div>
                                </nav>
                                <hr/>

                                <nav className="level">
                                    <div className="level-item level-left">
                                        <p className="title is-size-4">
                                            <span className="tag is-warning is-rounded is-large">Step 3</span>
                                            &nbsp;&nbsp;<span>What route length do you prefer?</span>
                                        </p>
                                    </div>
                                    <div className="level-item level-right">
                                        <div className="buttons has-addons">
                                            <IconButton icon="chess-pawn" size="large" type="info"
                                                        active>Short</IconButton>
                                            <IconButton icon="chess-rook" size="large">Medium</IconButton>
                                            <IconButton icon="chess-king" size="large">&nbsp;Long</IconButton>
                                        </div>
                                    </div>
                                </nav>
                                <hr/>

                                <nav className="level">
                                    <div className="level-item level-left">
                                        <p className="title is-size-4">
                                            <span className="tag is-warning is-rounded is-large">Step 4</span>
                                            &nbsp;&nbsp;<span>What do you want to see?</span>
                                        </p>
                                    </div>
                                    <div style={{maxWidth: 600}} className="level-item level-right">
                                        {this.renderDummyCheckboxes()}
                                    </div>
                                </nav>
                                <hr/>

                                <nav className="level">
                                    <div className="level-item level-left">
                                        <p className="title is-size-4">
                                            <span className="tag is-warning is-rounded is-large">
                                                &nbsp;&nbsp;&nbsp;&nbsp;<Icon
                                                icon="arrow-right"/>&nbsp;&nbsp;&nbsp;&nbsp;
                                            </span>
                                            &nbsp;&nbsp;<span>Let's begin:</span>
                                        </p>
                                    </div>
                                    <p className="level-item level-right">
                                        <Link to="/plan-route">
                                            <IconButton icon="angle-double-right" size="large" iconSize="large"
                                                        trailingIcon="angle-double-left" type="success">
                                                &nbsp;Start planning&nbsp;
                                            </IconButton>
                                        </Link>
                                    </p>
                                </nav>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
