/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import Promise from 'bluebird';

import Util from './util';
import Api from './api';

const LSNames = {
    AccessToken: 'accessToken',
    UserData: 'userData',
};

export default class Auth {

    /**
     * @param {WebappConfig} config
     */
    constructor(config) {
        this.config = config;

        this.api = new Api(this);
    }

    init() {
        return Promise.resolve()
            .then(() => this.api.clearAllDataLoaderCache())
            .then(() => this.attemptAuthFromLocalStorage())
            .catch(error => {
                // Authorization through local storage failed for whatever reason, logging in again.
                let message = `Authorization through local storage failed, logging in again. (${error.message})`;
                Util.logDebug(message);
                this.clearAuthData();

                // TODO: Replace this with proper auth
                return this.authenticateStaff({email: 'test@test.com', password: 'qwerty123456'});
            });
    }

    attemptAuthFromLocalStorage() {
        return Promise.resolve()
            .then(() => {
                const lsAccessToken = localStorage.getItem(LSNames.AccessToken);
                const lsUserData = JSON.parse(localStorage.getItem(LSNames.UserData));

                if (!lsAccessToken || !lsUserData) {
                    // Local storage auth data is corrupted, clear it, proceed like it never existed.
                    Auth.clearAuthLocalStorage();
                    throw new Error('Auth local storage data either not existent or corrupted.');
                }

                // Local storage data seems to be in tact, let's check if it's valid.
                this.accessToken = lsAccessToken;
                return Promise.resolve()
                    .then(() => this.api.userModule.profileLoader.load(lsUserData.userId))
                    .then(userData => ({accessToken: lsAccessToken, userData}))
                    .then(tokenData => this.consumeAccessTokenData(tokenData));
            });
    }

    /**
     * Logs the user out and clears data loader cache.
     */
    logout() {
        this.clearAuthData();
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
            .then(tokenData => this.consumeAccessTokenData(tokenData));
    }

    /**
     * @param {TokenData} tokenData
     * @returns {TokenData}
     */
    consumeAccessTokenData(tokenData) {
        this.accessToken = tokenData.accessToken;
        this.userData = tokenData.userData;
        localStorage.setItem(LSNames.AccessToken, this.accessToken);
        localStorage.setItem(LSNames.UserData, JSON.stringify(this.userData));
        return tokenData;
    }

    clearAuthData() {
        this.accessToken = null;
        this.userData = null;
        Auth.clearAuthLocalStorage();
    }

    static clearAuthLocalStorage() {
        localStorage.removeItem(LSNames.AccessToken);
        localStorage.removeItem(LSNames.UserData);
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