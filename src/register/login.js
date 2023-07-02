import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import './styles/Login.css'

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is logged in, redirect to feed section
        navigate('/feed');
      }
    });

    // Clean up the listener
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Login successful
        const user = userCredential.user;
        console.log('User logged in:', user);
        // Redirect to feed section
        navigate('/feed');
      })
      .catch((error) => {
        // Login failed
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Login failed:', errorCode, errorMessage);
      });
  };

  const handleGoogleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        // Google login successful
        const user = result.user;
        console.log('User logged in with Google:', user);
        // Redirect to feed section
        navigate('/feed');
      })
      .catch((error) => {
        // Google login failed
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Google login failed:', errorCode, errorMessage);
      });
  };

  return (
    <div className='Login'>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <button type="button" onClick={handleGoogleLogin}>
          Login with Google
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
