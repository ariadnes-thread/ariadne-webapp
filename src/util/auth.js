/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import Promise from 'bluebird';

import API from './api';

export default class Auth {

    constructor(config) {

    }

    init() {
        // TODO: Do auth initialization here - extract auth data from localStorage, redirect, etc.
        return Promise.resolve();
    }

}
