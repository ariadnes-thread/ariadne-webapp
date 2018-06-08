/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import Icon from '@fortawesome/react-fontawesome';
import 'react-select/dist/react-select.css';
import {Link} from 'react-router-dom';
import Select from 'react-select';
import _ from 'lodash';

import PreferencesState, {PreferenceSchema, PoiTypes, TransportType} from '../../util/preferences-state';
import PoiField from '../helpers/preference-fields/poi-field';
import IconButton from '../helpers/icon-button';
import React, {Component} from 'react';
import Card from '../helpers/card';

const LengthType = {
    Short: 'short',
    Medium: 'medium',
    Long: 'long',
};

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.prefState = new PreferencesState();

        this.state = {
            transportType: this.prefState.preferences.transportType,
            lengthType: LengthType.Medium,
            poiOptions: [],
            poiSelectValue: [],
        };

        const initialPois = this.prefState.get(PreferenceSchema.pointsOfInterest.name);
        _.forEach(PoiTypes, (poiType) => {
            const optionObject = {value: poiType.name, label: poiType.displayName};
            this.state.poiOptions.push(optionObject);
            if (initialPois[poiType.name]) {
                this.state.poiSelectValue.push(optionObject);
            }
        });

        this.onChange = this.onChange.bind(this);
    }

    chooseTransportType(value) {
        this.prefState.set(PreferenceSchema.transportType.name, value);
        this.setState({transportType: value});
    }

    chooseLength(value) {
        let actualLength = 2000;
        if (value === LengthType.Short) actualLength = 1000;
        else if (value === LengthType.Long) actualLength = 9500;

        this.prefState.set(PreferenceSchema.length.name, actualLength);
        this.setState({lengthType: value});
    }

    onChange(value) {
        this.setState({poiSelectValue: value});
        this.prefState.set(PreferenceSchema.pointsOfInterest.name, PoiField.getPoisObject(value));
    }

    render() {

        const walkTypeProp = this.state.transportType === TransportType.Walk ? {active: true, type: 'info'} : {};
        const runTypeProp = this.state.transportType === TransportType.Run ? {active: true, type: 'info'} : {};
        const bikeTypeProp = this.state.transportType === TransportType.Bike ? {active: true, type: 'info'} : {};

        const shortTypeProp = this.state.lengthType === LengthType.Short ? {active: true, type: 'info'} : {};
        const mediumTypeProp = this.state.lengthType === LengthType.Medium ? {active: true, type: 'info'} : {};
        const longTypeProp = this.state.lengthType === LengthType.Long ? {active: true, type: 'info'} : {};

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
                        {/* TODO: Show this when login system is working. */}
                        {/*<div className="column is-one-fifth">*/}
                        {/*<Card>*/}
                        {/*<div className="field">*/}
                        {/*<label className="label">Email</label>*/}
                        {/*<div className="control">*/}
                        {/*<input className="input" type="text" placeholder="john@example.com"/>*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        {/*<div className="field">*/}
                        {/*<label className="label">Password</label>*/}
                        {/*<div className="control">*/}
                        {/*<input className="input" type="password" placeholder="*******"/>*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        {/*<p className="link has-text-centered">Don't have an account?</p>*/}
                        {/*</Card>*/}
                        {/*</div>*/}
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
                                                <input className="input is-large is-info" type="text" readOnly disabled
                                                       placeholder="City, postcode, address" value="Pasadena (demo)"/>
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
                                            <IconButton icon="male" size="large" {...walkTypeProp}
                                                        onClick={() => this.chooseTransportType(TransportType.Walk)}>Walk</IconButton>
                                            <IconButton icon="child" size="large" {...runTypeProp}
                                                        onClick={() => this.chooseTransportType(TransportType.Run)}>Run</IconButton>
                                            <IconButton icon="bicycle" size="large" {...bikeTypeProp}
                                                        onClick={() => this.chooseTransportType(TransportType.Bike)}>&nbsp;Cycle</IconButton>
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
                                            <IconButton icon="chess-pawn" size="large" {...shortTypeProp}
                                                        onClick={() => this.chooseLength(LengthType.Short)}>Short</IconButton>
                                            <IconButton icon="chess-rook" size="large" {...mediumTypeProp}
                                                        onClick={() => this.chooseLength(LengthType.Medium)}>Medium</IconButton>
                                            <IconButton icon="chess-king" size="large" {...longTypeProp}
                                                        onClick={() => this.chooseLength(LengthType.Long)}>Long</IconButton>
                                        </div>
                                    </div>
                                </nav>
                                <hr/>

                                <nav className="level">
                                    <div className="level-item level-left">
                                        <p className="title is-size-4">
                                            <span className="tag is-warning is-rounded is-large">Step 4</span>
                                            &nbsp;&nbsp;<span>What do you want to see on your route?</span>
                                        </p>
                                    </div>
                                    <div style={{maxWidth: 600}} className="level-item level-right is-size-6">
                                        <div style={{width: '400px'}}>
                                            <Select
                                                options={this.state.poiOptions}
                                                value={this.state.poiSelectValue}
                                                onChange={this.onChange}
                                                matchPos="any"
                                                multi={true}/>
                                        </div>
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
                                        <Link to={{
                                            pathname: '/plan-route',
                                            initialPrefState: this.prefState,
                                        }}>
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
