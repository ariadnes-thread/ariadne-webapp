/**
 * @author Timur Kuzhagaliyev
 * @copyright 2018
 * @license GPL-3.0
 */

import ReactDOM from 'react-dom';
import Promise from 'bluebird';
import React from 'react';

import 'bulma/css/bulma.css';
import 'bulma-extensions/dist/bulma-extensions.min.css';
import './util/fontawesome/css/fontawesome-all.min.css';

// TODO: Uncomment once development is complete, scroll down for more info.
// import registerServiceWorker from './util/registerServiceWorker';
import StartupError from './components/startup-error';
import rawConfig from './config.json';
import App from './components/app';
import Auth from './util/auth';
import Util from './util/util';
import './index.css';

// Initialise an instance of Auth class - this instance is not global, it should be passed down to
// children components through dependency injection.
let auth = new Auth(rawConfig);

let componentToRender;
Promise.resolve()

    // Initialize Auth object - this loads user data from `localStorage`, checks that it's legit, redirects to login
    // page if necessary
    .then(() => auth.init())

    // Initialization successful, render the actual application
    .then(() => componentToRender = <App auth={auth}/>)

    // Initialization failed, render an error message
    .catch(error => {
        componentToRender = <StartupError/>;
        Util.logError(error);
    })

    .finally(() => {
        ReactDOM.render(componentToRender, document.getElementById('root'));

        // TODO: ServiceWorker is useful for faster loading in production but is a real pain in development since it
        //       makes it hard to deploy the new webapp version (old version "lingers" in the cache due to the
        //       service worker). Uncomment once the active development phase is over.
        // registerServiceWorker();
    });
