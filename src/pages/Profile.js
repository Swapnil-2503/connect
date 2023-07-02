import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import './styles/Profile.css'

function Profile() {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Fetch user profile data from Firestore
    const fetchUserProfile = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        try {
          const docRef = firebase.firestore().collection('users').doc(user.uid);
          const doc = await docRef.get();
          if (doc.exists) {
            setProfileData(doc.data());
          } else {
            console.log('No user profile data found.');
          }
        } catch (error) {
          console.error('Error fetching user profile data:', error);
        }
      } else {
        console.log('No user found. Please sign in.');
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log('User logged out');
        window.location.href = '/login'; // Redirect to login page
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  };

  return (
    <div className="Profile">
      <Navbar />
      <h2>Profile</h2>
      {profileData ? (
        <div>
          <p>Username: {profileData.username}</p>
          <p>Full Name: {profileData.fullName}</p>
          <p>Branch: {profileData.branch}</p>
          <p>Year: {profileData.year}</p>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        <p>Loading profile data...</p>
      )}
    </div>
  );
}

export default Profile;
