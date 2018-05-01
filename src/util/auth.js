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
        console.log(localStorage);
        // TODO: Do auth initialization here - extract auth data from localStorage, redirect, etc.
        return Promise.resolve()
            .then(() => {
                if (!this.isAuthenticated())
                {
                    // TODO: For now, just automatically initializing
                    console.log("Missing authentication data!  (Automatically logging in for debugging purposes)");
                    return this.doLogin({email: 'test@test.com', password: 'qwerty123456'});
                }
                else
                {
                    console.log("Has authentication data! :)");
                    return {accessToken: localStorage.accessToken, userData: localStorage.userData};
                }
            }).then(tokenData => this.consumeAccessTokenData(tokenData));
        //.then(() => this.api.clearAllDataLoaderCache())
    }

    /*
    * Checks if accessToken and userData are present (has an authenticated user logged in).
    */
    isAuthenticated() {
        return !(localStorage.getItem('accessToken') === null || localStorage.getItem('userData') === null)
    }

    doLogin(loginObj) {
        Promise.resolve()
            .then(() => {
                return this.authenticateStaff(loginObj);
            }).then((res) => {
                console.log(res);
                localStorage.setItem('accessToken', res.accessToken);
                localStorage.setItem('userData', res.userData);
            }
        )
            .catch(error => {
                console.error(JSON.stringify(error, null, 2));
                console.error(error);
                // TODO: Replace with user-friendly warning/modal
                alert('Error occurred during form submission. Check console.');
            });
    }
    /*
    * Clears the local storage (accessToken and userData) when the user logs out.
    */
    handleLogout() {
        localStorage.clear();
        this.api.clearAllDataLoaderCache();
    }

    /**
     * Authenticates a staff member using the API. Returns a promise that resolves if authentication is successful.
     *
     * @param {object} data
     * @param {string} data.email
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
        return tokenData;
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