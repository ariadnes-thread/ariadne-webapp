import {BrowserRouter} from 'react-router-dom';
import ReactDOM from 'react-dom';
import Promise from 'bluebird';
import 'bulma/css/bulma.css';
import React from 'react';

import registerServiceWorker from './registerServiceWorker';
import StartupError from './components/startup-error';
import rawConfig from './config.json';
import App from './components/app';
import Auth from './util/auth';
import './index.css';

// Initialise an instance of Auth class - this instance is not global, it should be passed down to
// children components through dependency injection.
let auth = new Auth(rawConfig);

let componentToRender;
Promise.resolve()
    .then(() => auth.init())
    .then(() => componentToRender = <BrowserRouter><App auth={auth}/></BrowserRouter>)
    .catch(error => {
        componentToRender = <StartupError/>;
        console.error(error);
    })
    .finally(() => {
        ReactDOM.render(componentToRender, document.getElementById('root'));
        registerServiceWorker();
    });
