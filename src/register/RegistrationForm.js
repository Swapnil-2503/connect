import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import './styles/RegistrationForm.css'
import { Link } from 'react-router-dom';

const RegistrationForm = ({ onSubmit }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form fields
    if (!fullName || !username || !branch || !year) {
      // Display error message or handle validation as needed
      return;
    }

    // Pass the entered data to the onSubmit callback
    onSubmit({
      fullName,
      username,
      branch,
      year,
    });
  };

  const checkUsernameAvailability = async () => {
    // Check if the username is available in Firebase Firestore
    const usernameRef = firebase.firestore().collection('users').where('username', '==', username);
    const snapshot = await usernameRef.get();

    if (snapshot.empty) {
      setUsernameError('Username is available');
    } else {
      setUsernameError('Username is already taken');
    }
  };

  return (
    <div className='RegistrationForm'>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onBlur={checkUsernameAvailability}
        />
        {usernameError && <p>{usernameError}</p>}
        <input
          type="text"
          placeholder="Branch"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <button type="submit">Next</button>
        Have already account?<Link to="/login">Login here</Link>
      </form>
    </div>
  );
};

export default RegistrationForm;
