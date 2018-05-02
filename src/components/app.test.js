import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import rawConfig from '../config.json';
import Auth from '../util/auth';
import {BrowserRouter} from 'react-router-dom';


it('renders without crashing', () => {
  const div = document.createElement('div');
  const auth = new Auth(rawConfig);
  ReactDOM.render(<BrowserRouter basename={rawConfig.baseUri}><App auth={auth}/></BrowserRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
