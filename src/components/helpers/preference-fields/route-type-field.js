/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {PreferenceSchema} from '../../../util/preferences-state';
import PreferenceField from './preference-field';

export default class RouteTypeField extends Component {

    static propTypes = {
        updatePreference: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.fieldData = PreferenceSchema.routeType;
        this.fieldName = this.fieldData.name;
        this.state = {
            enabled: this.fieldData.enabledByDefault,
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle(enabled) {

        const value = 123;
        if (enabled) this.props.updatePreference(this.fieldName, value);
        else this.props.updatePreference(this.fieldName, null);

        this.setState({enabled});
    }

    render() {
        return (
            <div>
                <PreferenceField fieldData={this.fieldData} toggle={this.toggle}>
                    <div className="select is-medium">
                        <select disabled>
                            <option>Point to point</option>
                        </select>
                    </div>
                </PreferenceField>
                {this.state.enabled &&
                <div>
                    <br/>
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
                </div>
                }
            </div>
        );
    }
}
