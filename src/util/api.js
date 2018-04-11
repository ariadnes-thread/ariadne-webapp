/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import request from 'superagent';

import ApiAuthModule from './api-modules/api-auth';
import ApiPlanningModule from './api-modules/api-planning';

export default class Api {

    /**
     * @param {Auth} auth
     */
    constructor(auth) {
        this.auth = auth;

        const moduleConfig = {auth: this.auth, api: this};
        this.authModule = new ApiAuthModule(moduleConfig);
        this.planningModule = new ApiPlanningModule(moduleConfig);
    }

    /**
     * Clears `dataloader` cache for all elements
     * @see https://github.com/facebook/dataloader#clearing-cache
     */
    clearAllDataLoaderCache() {
        this.authModule.clearDataLoaderCache();
        this.planningModule.clearDataLoaderCache();
    }

    /**
     * Adds common API endpoint address parts to the supplied URI, "completing" it.
     * @param {string} uri
     * @returns {string}
     */
    expandEndpointUrl(uri) {
        return `${this.auth.config.apiHost}/api${uri}`;
    }

    ensureToken() {
        if (!this.auth.accessToken) throw new Error('Access token is not set in Auth object!');
    }

    getWithAuth(uri) {
        return Promise.resolve()
            .then(() => this.ensureToken())
            .then(() =>
                request
                    .get(this.expandEndpointUrl(uri))
                    .set('Authorization', `Bearer ${this.auth.accessToken}`)
                    .set('Accept', 'application/json')
                    .then(response => response.body)
            );
    }

    deleteWithAuth(uri) {
        return Promise.resolve()
            .then(() => this.ensureToken())
            .then(() =>
                request
                    .delete(this.expandEndpointUrl(uri))
                    .set('Authorization', `Bearer ${this.auth.accessToken}`)
                    .set('Accept', 'application/json')
                    .then(response => response.body)
            );
    }

    putWithAuth(uri, data) {
        return Promise.resolve()
            .then(() => this.ensureToken())
            .then(() =>
                request
                    .put(this.expandEndpointUrl(uri))
                    .set('Authorization', `Bearer ${this.auth.accessToken}`)
                    .set('Accept', 'application/json')
                    .type('form')
                    .send(data)
                    .then(response => response.body)
            );
    }

    post(uri, data) {
        return request
            .post(this.expandEndpointUrl(uri))
            .set('Accept', 'application/json')
            .type('form')
            .send(data)
            .then(response => response.body)
    }

    postWithAuth(uri, data) {
        return Promise.resolve()
            .then(() => this.ensureToken())
            .then(() =>
                request
                    .post(this.expandEndpointUrl(uri))
                    .set('Authorization', `Bearer ${this.auth.accessToken}`)
                    .set('Accept', 'application/json')
                    .type('form')
                    .send(data)
                    .then(response => response.body)
            );
    }

}
 