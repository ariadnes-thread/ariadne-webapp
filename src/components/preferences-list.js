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
                            "time": ["60", "range"],
                            "origin": ["Origin PoI", "text"],
                            "destination": ["Destination PoI", "text"]};

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
                        origin: [0, "text"],
                        destination: [0, "text"],
                    },
                });
            })
            .catch(error => {
                console.error(error);
                console.error(JSON.stringify(error));
                // TODO: Replace this with a nice modal popup
                // If not logged in, there will be a different error that prevents anything from happening.
                if (this.props.auth.isAuthenticated())
                    console.log('Error occurred while fetching points of interest. Check console.');
//                    alert('Error occurred while fetching points of interest. Check console.');
            });
    }

    handleChange(fieldName, fieldType, event) {
        // console.log(fieldName);
        // console.log(fieldType);
        console.log(event);
        let value = event.target.value;
        // if (['origin', 'destination'].includes(fieldName)) {
        //     value = this.state.pointsOfInterest[value];
        //     console.log(value);
        // }
        this.setState({
            preferences: {
                ...this.state.preferences,
                [fieldName]: [value, fieldType],
            },
        });
    }

    handleSelectZip(index, event) {
        event.preventDefault();
        this.setState({selectedInput: index});
    }

    updateZipPref(zip) {
        if (this.state.selectedInput === 0)
        {        
            this.setState({
                preferences: {
                    ...this.state.preferences,
                    "startZip": [zip, "text"],
                },
            });
        }
        else if (this.state.selectedInput === 1)
        {
            this.setState({
                preferences: {
                    ...this.state.preferences,
                    "endZip": [zip, "text"],
                },
            });
        }

    }


    handleSubmit(event) {
        event.preventDefault();
        
        return Promise.resolve()
            .then(() => {
                let retpref = {};

                Object.keys(this.state.preferences).map((preference) => {
                    if (preference === "origin" || preference === "destination")
                        retpref[preference] = this.state.pointsOfInterest[this.state.preferences[preference][0]];
                    else
                        retpref[preference] = this.state.preferences[preference][0];
                });
                return retpref;

            }).then((retpref) => {
                console.log('HEEEREEE!');
                return this.props.auth.api.planningModule.planRoute({constraints: retpref});
            })

            // The format of the route returned from the API is different from what we use locally, see:
            // https://api.ariadnes-thread.me/#api-v1_Planning-planning_route
            .then(routeData => routeData.route)
            .then(geometry => this.props.visualizeRoute({geometry}))
            .catch(error => {
                console.error(error);
                console.error("error from submitting preferences");
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
                                        <select onChange={this.handleChange.bind(this, 'origin', 'select')}>
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
                                        <select onChange={this.handleChange.bind(this, 'destination', 'select')}>
                                            {this.renderPointsOfInterestSelect()}
                                        </select>
                                    </div>
                                    <span className="icon is-small is-left"><Icon icon="map-marker-alt"/></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ariadne-scrollable card-preferences-list">
                    <div className="ariadne-scroll-card">

                    {
                        this.state ? Object.keys(this.state.preferences).map((preference, idx) => {
                            return (<div key={'preference-input'+idx}>
                             {preference}:
                             {this.state.preferences[preference][1]!=="text"
                                ? this.state.preferences[preference][0]
                                : <button onClick={this.handleSelectZip.bind(this,idx)}>Select on Map</button>} 
                             <input 
                                type={this.state.preferences[preference][1]}
                                
                                value={
                                    this.state.preferences[preference][0]
                                } 
                                onChange={this.handleChange.bind(this, preference, this.state.preferences[preference][1])}
                             />
                            </div>);
                        })
                        : "Missing State"
                    }
                    </div>
                    </div>
                    <br/>
                    <button className="button is-info">Update routes list</button>
                </form>
            </div>
        );
    }
}
