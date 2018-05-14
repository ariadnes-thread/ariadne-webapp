/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2018
 * @license GPL-3.0
 */

class Util {

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
        /* eslint-disable no-console */
        console.debug(data);
        /* eslint-enable no-console */
    }

}

module.exports = Util;
