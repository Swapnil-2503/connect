import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const root = ReactDOM.createRoot(document.getElementById('root'));

const firebaseConfig = {
  // Your Firebase configuration options
  apiKey: "AIzaSyBw7TGAEcC7wtVdiL-VSBM5eAhiaa6sYzo",
  authDomain: "connectcampus-c419e.firebaseapp.com",
  databaseURL: "https://connectcampus-c419e-default-rtdb.firebaseio.com",
  projectId: "connectcampus-c419e",
  storageBucket: "connectcampus-c419e.appspot.com",
  messagingSenderId: "505451706913",
  appId: "1:505451706913:web:1063f8608c39e334f14160",
  measurementId: "G-QQK9TYMEXY"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
