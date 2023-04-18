import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './samples/node-api'
import "./index.css"
import {HashRouter} from "react-router-dom"
import {Provider} from 'react-redux';

import store from '@/redux/store';
import axios from 'axios';
import { AliveScope } from 'react-activation';
axios.defaults.baseURL = "https://netease-cloud-music-api-ecru-nu.vercel.app/"
axios.defaults.timeout = 15000

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <Provider store={store}>
        <AliveScope>
          <App />
        </AliveScope>
      </Provider>
    </HashRouter>
  </React.StrictMode>,
)

postMessage({ payload: 'removeLoading' }, '*')
