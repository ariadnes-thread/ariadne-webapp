/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import Promise from 'bluebird';

import Api from './api';

export default class Auth {

    /**
     * @param {WebappConfig} config
     */
    constructor(config) {
        this.config = config;

        this.api = new Api(this);
    }

    init() {
        // TODO: Do auth initialization here - extract auth data from localStorage, redirect, etc.
        return Promise.resolve()
            .then(() => this.api.clearAllDataLoaderCache())

            // For now, we just instantly authorize the user with some fake data.
            // TODO: Replace this with attempting authenticate user from `localStorage`.
            .then(() => this.authenticateStaff({username: 'any username works', password: 'same for password'}));
    }

    /**
     * Authenticates a staff member using the API. Returns a promise that resolves if authentication is successful.
     *
     * @param {object} data
     * @param {string} data.username
     * @param {string} data.password
     */
    authenticateStaff(data) {
        return Promise.resolve()
            .then(() => this.api.authModule.fetchStaffAccessTokenData(data))
            .then(tokenData => this.consumeAccessTokenData(tokenData))
    }

    /**
     * @param {TokenData} tokenData
     */
    consumeAccessTokenData(tokenData) {
        this.accessToken = tokenData.accessToken;
        this.userData = tokenData.userData;
    }

    getGoogleApiUrl() {
        if (!this._googleMapUrl) {
            const apiKey = this.config.googleApiKey;
            let googleMapUrl = 'https://maps.googleapis.com/maps/api/js';
            googleMapUrl += '?v=3.exp&libraries=geometry,drawing,places';
            if (apiKey) googleMapUrl += `&key=${apiKey}`;
            this._googleMapUrl = googleMapUrl;
        }
        return this._googleMapUrl;
    }

}
