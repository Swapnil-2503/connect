import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './register/login';
import Register from './register/register';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Chats from './pages/Connect';
import Footer from './components/Footer';
import Sender from './components/Sender';
import Navbar from './components/Navbar';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";




// Add your Firebase configuration object here
const firebaseConfig = {
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const App = () => {
  return (
    <div className='App'>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feed" element={<Feed />} />
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/chats' element={<Chats/>}/>
        <Route path="/sender" element={<Sender/>} />
      </Routes>
    </Router>
    <Footer/>
    </div>
  );
};

export default App;
