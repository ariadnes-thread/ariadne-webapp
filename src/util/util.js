/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

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
     * @param {object} data
     * @param {*} data.object Error object that will be parsed for human readable output
     * @param {string} [data.message] Optional message to give some context to the error
     */
    static logError(data) {
        /* eslint-disable no-console */
        if (data.message) console.error(data.message);
        console.error(data.object);
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
