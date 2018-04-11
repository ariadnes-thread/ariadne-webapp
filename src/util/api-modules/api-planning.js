/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

export default class ApiPlanningModule {

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
     * @param {object} data.constraints
     * @returns {Promise<object[]>}
     */
    planRoute(data) {
        return this.api.postWithAuth('/v1/planning/route', data)
            .then(responseBody => responseBody.route);
    }

}
