import './assets/scss/common.scss';

import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import axios, { AxiosInstance } from 'axios';
import { findGetParameter } from './utils';


declare global {
  //전역 설정
  interface Window {
    // 윈도우 가변 스케일 값
    scale: number;
    // axios 인스턴스
    http: AxiosInstance;
    // 테스트 API 사용 유무
    isTestAPI: boolean;
  }
}


window.isTestAPI = false;

if (window.isTestAPI) {
  window.http = axios.create({ baseURL: `${process.env.PUBLIC_URL}/api` });
} else {
  window.http = axios.create({ baseURL: `https://apis.littlefox.com/api/v1`});
}



const page = findGetParameter('page');
const stage = findGetParameter('stage');
const step = findGetParameter('step');
const PageComponent = page ? lazy(() => import(`./pages/${page}`)) : null;


ReactDOM.render(
  <React.StrictMode>
    { PageComponent && 
      <Suspense fallback={null}>
        <PageComponent
          stage={stage}
          step={step} />
      </Suspense>
    }
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
