/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import Icon from '@fortawesome/react-fontawesome';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import PreferencesState from '../../util/preferences-state';
import IconButton from './icon-button';
import Card from './card';

export default class PreferenceEditor extends Component {

    static propTypes = {
        generateRoute: PropTypes.func,
    };


    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        // TODO: Replace with actual data
        if (this.props.generateRoute) this.props.generateRoute(new PreferencesState());
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <Card>
                    <p>You're almost there! Tell us about your preferences to help us find a perfect route
                        for you. If you care about a particular route feature, turn it on and specify a
                        value. Click "Generate route" once you're done!</p>
                </Card>
                <Card>

                    <div className="columns is-vcentered">
                        <div className="column is-narrow">
                            <div className="field">
                                <input className="is-checkradio is-medium" id="routeTypeCb"
                                       type="checkbox" name="routeTypeCb" checked="checked"/>
                                <label htmlFor="routeTypeCb">Route type</label>
                            </div>
                        </div>
                        <div className="column has-text-right">
                            <div className="buttons has-addons is-right">
                                <IconButton icon="male" size="medium" type="info" active>
                                    Walk
                                </IconButton>
                                <IconButton icon="child" size="medium">Run</IconButton>
                                <IconButton icon="bicycle" size="medium">&nbsp;Cycle</IconButton>
                            </div>
                        </div>
                    </div>

                    <div className="ariadne-compact-divider"/>

                    <div className="columns is-vcentered">
                        <div className="column is-narrow">
                            <div className="field">
                                <input className="is-checkradio is-medium" id="scanAreaCb"
                                       type="checkbox" name="scanAreaCb" checked="checked"/>
                                <label htmlFor="scanAreaCb">Scan area</label>
                                <Icon style={{margin: '0 0 -4px -7px', color: '#ccc'}} icon="question-circle"/>
                            </div>
                        </div>
                        <div className="column has-text-right">
                            <div className="select is-medium">
                                <select>
                                    <option>Currently visible map</option>
                                    <option>Radius</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="ariadne-compact-divider"/>

                    <div className="columns is-vcentered">
                        <div className="column is-narrow">
                            <div className="field">
                                <input className="is-checkradio is-medium" id="lengthCb"
                                       type="checkbox" name="lengthCb"/>
                                <label htmlFor="lengthCb">Length</label>
                            </div>
                        </div>
                        <div className="column has-text-right">
                            <input className="slider is-disabled is-fullwidth" step="1" min="0" max="100"
                                   value="50"
                                   type="range"/>
                        </div>
                    </div>

                    <div className="ariadne-compact-divider"/>

                    <div className="columns is-vcentered">
                        <div className="column is-narrow">
                            <div className="field">
                                <input className="is-checkradio is-medium" id="startFinishCb"
                                       type="checkbox" name="startFinishCb" checked="checked"/>
                                <label htmlFor="startFinishCb">Start and finish</label>
                            </div>
                        </div>
                        <div className="column has-text-right">
                            <div className="select is-medium">
                                <select>
                                    <option>Custom</option>
                                    <option>With options</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="field is-horizontal">
                        <div className="field-label is-normal">
                            <label className="label">Start</label>
                        </div>
                        <div className="field-body">
                            <div className="field has-addons">
                                <div className="control">
                                    <input className="input" type="text" placeholder="Postcode, address"/>
                                </div>
                                <div className="control">
                                    <a className="button is-info">Pick on the map</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="field is-horizontal">
                        <div className="field-label is-normal">
                            <label className="label">Finish</label>
                        </div>
                        <div className="field-body">
                            <div className="field has-addons">
                                <div className="control">
                                    <input className="input" type="text" placeholder="Postcode, address"/>
                                </div>
                                <div className="control">
                                    <a className="button is-info">Pick on the map</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="ariadne-divider"/>

                    <button className="button is-large is-fullwidth is-success">Generate route</button>
                </Card>
            </form>
        );
    }
}
