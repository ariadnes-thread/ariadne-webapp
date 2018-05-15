/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import Util from '../util';

export default class ApiUserModule {

    /**
     * @param {object} data
     * @param {Auth} data.auth
     * @param {Api} data.api
     */
    constructor(data) {
        this.auth = data.auth;
        this.api = data.api;

        this.profileLoader = Util.prepareDataLoader(userId => this.fetchUserProfile({userId}));
    }

    clearDataLoaderCache() {
        this.profileLoader.clearAll();
    }

    /**
     * @param {object} data
     * @param {string} data.userId
     * @returns {Promise<UserData>}
     */
    fetchUserProfile(data) {
        return this.api.getWithAuth(`/v1/users/${data.userId}/profile`)
            .then(response => response.userData);
    }

}
