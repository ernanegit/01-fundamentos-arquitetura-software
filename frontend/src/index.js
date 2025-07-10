import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Configuração global do Axios
import axios from 'axios';

// Base URL para produção vs desenvolvimento
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
axios.defaults.baseURL = API_BASE_URL;

// Interceptor para logging (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  axios.interceptors.request.use(request => {
    console.log('🚀 API Request:', request.method?.toUpperCase(), request.url);
    return request;
  });

  axios.interceptors.response.use(
    response => {
      console.log('✅ API Response:', response.status, response.config.url);
      return response;
    },
    error => {
      console.error('❌ API Error:', error.response?.status, error.config?.url);
      return Promise.reject(error);
    }
  );
}

// Timeout global
axios.defaults.timeout = 10000;

// Headers padrão
axios.defaults.headers.common['Content-Type'] = 'application/json';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);