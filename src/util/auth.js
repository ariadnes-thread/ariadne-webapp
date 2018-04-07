/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import Promise from 'bluebird';

import Api from './api';

export default class Auth {

    /**
     * @param {object} config
     */
    constructor(config) {
        this.config = config;

        this.api = new Api(this);
    }

    init() {
        // TODO: Do auth initialization here - extract auth data from localStorage, redirect, etc.
        return Promise.resolve();
    }

}
