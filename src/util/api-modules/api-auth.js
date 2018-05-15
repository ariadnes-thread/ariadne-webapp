/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

export default class ApiAuthModule {

    /**
     * @param {object} data
     * @param {Auth} data.auth
     * @param {Api} data.api
     */
    constructor(data) {
        this.auth = data.auth;
        this.api = data.api;
    }

    clearDataLoaderCache() {
        // Add all data loaders here.
    }

    /**
     * @param {object} data
     * @param {string} data.email
     * @param {string} data.password
     * @returns {Promise<TokenData>}
     */
    fetchStaffAccessTokenData(data) {
        return this.api.post('/v1/auth/staff-login', data);
    }

}
