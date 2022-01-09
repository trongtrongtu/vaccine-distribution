import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Appmain from './Appmain';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router } from 'react-router-dom';
import 'antd/dist/antd.css';

ReactDOM.render(
    <Router>
        <Appmain />
    </Router>
    ,

    document.getElementById('root'),
);
registerServiceWorker();
