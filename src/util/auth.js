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
                    console.log("Missing authentication data!  (Automatically logging in for debugging purposes)");
                    // return this.authenticateStaff({email: 'test@test.com', password: 'qwerty123456'});
                    return {accessToken: localStorage.accessToken, userData: localStorage.userData};
                }
                else
                {
                    console.log("Has authentication data! :)");
                    return {accessToken: localStorage.accessToken, userData: localStorage.userData};
                }
            }).then(tokenData => this.consumeAccessTokenData(tokenData));
            // .then((res) => {
            //     console.log(res);
            //     if (res) {
            //     localStorage.setItem('accessToken', res.accessToken);
            //     localStorage.setItem('userData', res.userData);
            // }
            // })
            // .then(() => {
            //     console.log(this.isAuthenticated());
            // });
            //.then(() => this.api.clearAllDataLoaderCache())

            // For now, we just instantly authorize the user with some fake data.
            // TODO: Replace this with attempting authenticate user from `localStorage`.
            //.then(() => this.authenticateStaff({email: 'test@test.com', password: 'qwerty123456'}));
    }

    /*
    * Checks if accessToken and userData are present (has an authenticated user logged in).
    */
    isAuthenticated() {
        return !(localStorage.getItem('accessToken') === null || localStorage.getItem('userData') === null)
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
