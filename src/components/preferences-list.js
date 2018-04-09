/**
 * @author Mary Giambrone
 * @copyright 2018
 * @license GPL-3.0
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Promise from 'bluebird';

import Auth from '../util/auth';


export default class PreferencesList extends Component {

    static propTypes = {
        auth: PropTypes.instanceOf(Auth).isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {};

        // TO DO: drag and drop ordering of preferences
        this.preferences = ["greenery", "elevation", "distance"];
        this.defaultValues = ["50", "20", "30"];

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
                    {
                        this.preferences.map((preference, idx) => {
                            return (<div key={'preference-input'+idx}>
                             {preference}:
                             {this.state[preference] ? this.state[preference] : this.defaultValues[idx]} 
                             <input type="range" defaultValue={this.defaultValues[idx]} 
                             onChange={this.handleChange.bind(this, preference)}/>
                            </div>);
                        })
                    }
                    <br/>
                    <button className="button is-info">Update route</button>
                </form>
        	</div>
        );
    }
}
