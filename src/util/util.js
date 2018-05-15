/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

import DataLoader from 'dataloader';
import Swal from 'sweetalert2';

export default class Util {

    /**
     * @param {object} data
     * @param {string} [data.title]
     * @param {string} [data.message]
     * @param {*} [data.console] Object or error to log to console.
     */
    static showErrorModal(data) {
        if (!data) data = {};
        const errorData = {
            title: data.title ? data.title : 'Oops...',
            message: data.message ? data.message : 'Something went wrong!',
        };

        if (data.console) {
            Util.logError(data.console);
            errorData.message += ' Check console for more details.';
        }

        Swal(errorData.title, errorData.message, 'error');
    }

    /**
     * Prepares instances of the `dataloader` package.
     * @see https://github.com/facebook/dataloader
     * @param {function} funcReturningAPromise
     * @param {function} cacheKeyFn
     * @returns {DataLoader | DataLoader<any, any>}
     */
    static prepareDataLoader(funcReturningAPromise, cacheKeyFn = id => id) {
        return new DataLoader(Util.arraifyPromiseFunc(funcReturningAPromise), {batch: false, cacheKeyFn});
    }

    /**
     * `dataloader` package expects functions that take an array and return a Promise<array>. This function converts
     * functions with a single argument/single return value into `dataloader` style functions.
     *
     * @param {function} funcReturningAPromise
     * @returns {function(array)}
     */
    static arraifyPromiseFunc(funcReturningAPromise) {
        return array => {
            return funcReturningAPromise(array[0])
                .then(returnValue => [returnValue]);
        };
    }

    /**
     * @param {object} data
     * @param {*} data.error Error object that will be parsed for human readable output
     * @param {string} [data.message] Optional message to give some context to the error
     */
    static logError(data) {
        /* eslint-disable no-console */
        if (data.message) console.error(data.message);
        console.error(data.error);
        /* eslint-enable no-console */
    }

    /**
     * @param {*} data
     */
    static logWarn(data) {
        /* eslint-disable no-console */
        console.warn(data);
        /* eslint-enable no-console */
    }

    /**
     * @param {*} data
     */
    static logDebug(data) {
        let args = [].slice.call(arguments);
        /* eslint-disable no-console */
        console.debug.apply(null, args);
        /* eslint-enable no-console */
    }

}
