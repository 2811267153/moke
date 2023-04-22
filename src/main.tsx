import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import "./index.css"
import {HashRouter} from "react-router-dom"
import {Provider} from 'react-redux';

import store from '@/redux/store';
import axios from 'axios';
axios.defaults.baseURL =  "https://service-7pl5xj3e-1259570890.gz.apigw.tencentcs.com/release/"
axios.defaults.timeout = 15000

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <Provider store={store}>
          <App />
      </Provider>
    </HashRouter>
  </React.StrictMode>,
)

postMessage({ payload: 'removeLoading' }, '*')
