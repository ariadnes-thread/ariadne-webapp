/**
 * @author Mary Giambrone
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Promise from 'bluebird';

import Auth from '../util/auth';

const defaultPreferences = {"greenery": "50",
                            "elevation": "20",
                            "distance": "30",
                            "cofeeshops": "2",
                            "time": "60"};

export default class PreferencesList extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
    };

    constructor(props) {
        super(props);

        this.state = defaultPreferences;

        // TO DO: drag and drop ordering of preferences

        // this.setState(this.defaultPreferences);

        console.log(Object.keys(defaultPreferences));
        // this.preferences = ["greenery", "elevation", "distance", "coffeeshops", "time (minutes)"];
        // this.defaultValues = ["50", "20", "30", "2", "60"];

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(idx, event) {
        event.preventDefault();
        this.setState({[idx]: event.target.value});
    }


    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state);
        // TO DO: Send the preferences to our API to calculate the optimal route
    }

    render() {
        return (
            <div className="preferences-list">
                <form onSubmit={this.handleSubmit}>
                    <div className="ariadne-scrollable card-preferences-list">
                    {
                        this.state ? Object.keys(this.state).map((preference, idx) => {
                            return (<div key={'preference-input'+idx}>
                             {preference}:
                             {this.state[preference]} 
                             <input type="range" defaultValue={defaultPreferences[preference]} 
                             onChange={this.handleChange.bind(this, preference)}/>
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
        // return (
        //     <div className="preferences-list">
        //         <form onSubmit={this.handleSubmit}>
        //             <div className="ariadne-scrollable card-preferences-list">
        //             {
        //                 this.preferences.map((preference, idx) => {
        //                     return (<div key={'preference-input'+idx}>
        //                      {preference}:
        //                      {this.state[preference] ? this.state[preference] : this.defaultValues[idx]} 
        //                      <input type="range" defaultValue={this.defaultValues[idx]} 
        //                      onChange={this.handleChange.bind(this, preference)}/>
        //                     </div>);
        //                 })
        //             }
        //             </div>
        //             <br/>
        //             <button className="button is-info">Update routes list</button>
        //         </form>
        // 	</div>
        // );
    }
}
