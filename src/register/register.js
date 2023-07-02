import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import RegistrationForm from './RegistrationForm';
import './styles/Register.css'

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  const handleRegistrationFormSubmit = (data) => {
    const { username, fullName, branch, year } = data;

    // Check if all fields are filled
    if (!username || !fullName || !branch || !year) {
      setError('Please fill in all fields');
      return;
    }

    setUsername(username);
    setFullName(fullName);
    setBranch(branch);
    setYear(year);
    setStep(2);
  };

  const saveUserProfileToFirestore = (user) => {
    const userProfile = {
      username,
      fullName,
      branch,
      year,
    };

    // Save user profile information to Firestore
    firebase
      .firestore()
      .collection('users')
      .doc(user.uid)
      .set(userProfile)
      .then(() => {
        console.log('User profile saved to Firestore:', userProfile);
      })
      .catch((error) => {
        console.error('Failed to save user profile:', error);
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!email || !password || !username || !fullName || !branch || !year) {
      setError('Please fill in all fields');
      return;
    }

    // Register user with email and password
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Registration successful
        const user = userCredential.user;
        console.log('User registered:', user);

        // Save user profile information to Firestore
        saveUserProfileToFirestore(user);

        // Redirect to login page
        navigate('/login');
      })
      .catch((error) => {
        // Registration failed
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Registration failed:', errorCode, errorMessage);
        setError(errorMessage);
      });
  };

  const handleGoogleRegister = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        // Google registration successful
        const user = result.user;
        console.log('User registered with Google:', user);

        // Save user profile information to Firestore
        saveUserProfileToFirestore(user);

        // Redirect to login page
        navigate('/login');
      })
      .catch((error) => {
        // Google registration failed
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Google registration failed:', errorCode, errorMessage);
        setError(errorMessage);
      });
  };

  const renderForm = () => {
    if (step === 1) {
      return (
        <RegistrationForm onSubmit={handleRegistrationFormSubmit} />
      );
    } else if (step === 2) {
      return (
        <form onSubmit={handleRegister}>
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
          <button type="submit">Register</button>
          <button type="button" onClick={handleGoogleRegister}>
            Register with Google
          </button>
        </form>
      );
    }
  };

  return (
    <div className='Register'>
      <h2>Register</h2>
      {renderForm()}
      
      {error && <p>{error}</p>}
    </div>
  );
};

export default Register;
