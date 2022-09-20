import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import  App  from './App'
import { queryClient } from './services/queryClient'
import { AuthProvider } from './context/auth'
import axios from 'axios'

if(process.env.NODE_ENV === 'development'){
  axios.defaults.baseURL = 'http://localhost:80';
  axios.defaults.headers.common['Authorization'] = 'AUTH TOKEN';
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = 'origin-list';
}else{
  axios.defaults.baseURL = 'https://apiomsexemple.herokuapp.com/';
  axios.defaults.headers.common['Authorization'] = 'AUTH TOKEN';
  axios.defaults.headers.post['Content-Type'] = 'apapplication/json; charset=utf-8plication/json';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = 'origin-list';

}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
  
)
