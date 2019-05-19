import React from 'react';
import {render} from 'react-dom';
import App from './App.jsx';


render(
      <App/>
    , document.getElementById('app'));

if (module.hot) {
    module.hot.accept();
    // console.log('--hot!--')
} else {
    // console.log('--!hot--')
}
