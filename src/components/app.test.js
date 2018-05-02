import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import rawConfig from '../config.json';
import Auth from '../util/auth';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const auth = new Auth(rawConfig);
  ReactDOM.render(<App auth={auth}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
