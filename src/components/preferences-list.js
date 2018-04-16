/**
 * @author Mary Giambrone
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import Icon from '@fortawesome/react-fontawesome';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Promise from 'bluebird';

import Auth from '../util/auth';


const defaultPreferences = {"startZip":["write in!", "text"],
                            "endZip":["write in!", "text"],
                            "search radius": ["1", "range"],
                            "greenery": ["50", "range"],
                            "elevation": ["20", "range"],
                            "distance": ["30", "range"],
                            "cofeeshops": ["2", "range"],
                            "time": ["60", "range"],};

export default class PreferencesList extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
        visualizeRoute: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {preferences: defaultPreferences,
                        pointsOfInterest: null,
                        selectedInput: -1};

        // TO DO: drag and drop ordering of preferences

        this.handleSubmit = this.handleSubmit.bind(this);

    }

    componentDidMount() {
        Promise.resolve()
            .then(() => this.props.auth.api.planningModule.fetchPointsOfInterest())
            .then(pointsOfInterest => {
                this.setState({
                    pointsOfInterest,
                    preferences: {
                        ...this.state.preferences,
                        // origin: pointsOfInterest[0],
                        // destination: pointsOfInterest[1],
                    },
                });
            })
            .catch(error => {
                console.error(error);
                // TODO: Replace this with a nice modal popup
                alert('Error occurred while fetching points of interest. Check console.');
            });
    }

    handleChange(fieldName, event) {
        console.log(fieldName);
        console.log(event);
        let value = event.target.value;
        if (['origin', 'destination'].includes(fieldName)) {
            value = this.state.pointsOfInterest[value];
            console.log(value);
        }

        this.setState({
            preferences: {
                ...this.state.preferences,
                [fieldName]: value,
            },
        });
    }

    handleSelectZip(index, event) {
        event.preventDefault();
        console.log(index);
        this.setState({selectedInput: index});
    }

    updateZipPref(zip) {
        console.log("HERE");
        console.log("zip to update is " + zip);
        console.log("index to update is " + this.state.selectedInput);

    }


    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state);

        return Promise.resolve()
            .then(() => this.props.auth.api.planningModule.planRoute({constraints: this.state.preferences}))

            // The format of the route returned from the API is different from what we use locally, see:
            // https://api.ariadnes-thread.me/#api-v1_Planning-planning_route
            .then(routeData => routeData.route)
            .then(geometry => this.props.visualizeRoute({geometry}))
            .catch(error => {
                console.error(error);
                // TODO: Replace with user-friendly warning/modal
                alert(error.message);
            });
    }

    renderPointsOfInterestSelect() {
        const pointsOfInterest = this.state.pointsOfInterest;
        if (!pointsOfInterest) {
            // TODO: Add an indicator for failed loading
            return <option disabled>Loading...</option>;
        }

        const optionsComponents = new Array(pointsOfInterest.length);
        for (let i = 0; i < pointsOfInterest.length; i++) {
            const point = pointsOfInterest[i];
            optionsComponents[i] = <option key={`poi-${i}`} value={i}>{point.name}</option>;
        }
        return optionsComponents;
    }

    render() {
        return (
            <div className="container-preferences-list">
                <form onSubmit={this.handleSubmit}>
                    <div className="field is-horizontal">
                        <div className="field-label is-normal">
                            <label className="label">From</label>
                        </div>
                        <div className="field-body">
                            <div className="field">
                                <div className="control is-expanded has-icons-left">
                                    <div className="select">
                                        <select onChange={this.handleChange.bind(this, 'origin')}>
                                            {this.renderPointsOfInterestSelect()}
                                        </select>
                                    </div>
                                    <span className="icon is-small is-left"><Icon icon="map-marker-alt"/></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="field is-horizontal">
                        <div className="field-label is-normal">
                            <label className="label">To</label>
                        </div>
                        <div className="field-body">
                            <div className="field">
                                <div className="control is-expanded has-icons-left">
                                    <div className="select">
                                        <select onChange={this.handleChange.bind(this, 'destination')}>
                                            {this.renderPointsOfInterestSelect()}
                                        </select>
                                    </div>
                                    <span className="icon is-small is-left"><Icon icon="map-marker-alt"/></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ariadne-scrollable card-preferences-list">
                    {
                        this.state ? Object.keys(this.state.preferences).map((preference, idx) => {
                            return (<div key={'preference-input'+idx}>
                             {preference}:
                             {this.state.preferences[preference][1]!="text"
                                ? this.state.preferences[preference][0]
                                : <button onClick={this.handleSelectZip.bind(this,idx)}>Select on Map</button>} 
                             <input 
                                type={this.state.preferences[preference][1]}
                                defaultValue={defaultPreferences[preference][0]} 
                                onChange={this.handleChange.bind(this, preference)}
                             />
                            </div>);
                        })
                        : "Missing State"
                    }
                    </div>
                    <br/>
                    <button className="button is-info">Update routes list</button>
                </form>
            </div>
        );
    }
}
