import React from 'react'

function Sender() {
  return (
    <div className="Sender">
        <h1>This page is under construction</h1>
    </div>
  )
}

export default Sender;
// import React, { useState, useEffect } from 'react';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';

// function UserProfile({ match }) {
//   const [profileData, setProfileData] = useState(null);

//   useEffect(() => {
//     // Fetch user profile data from Firestore
//     const fetchUserProfile = async () => {
//       const user = firebase.auth().currentUser;
//       if (user) {
//         try {
//           const docRef = firebase.firestore().collection('users').doc(user.uid);
//           const doc = await docRef.get();
//           if (doc.exists) {
//             setProfileData(doc.data());
//           } else {
//             console.log('No user profile data found.');
//           }
//         } catch (error) {
//           console.error('Error fetching user profile data:', error);
//         }
//       } else {
//         console.log('No user found. Please sign in.');
//       }
//     };

//     fetchUserProfile();
//   }, []);


//   return (
//     <div className="Profile">
//       <h2>Profile</h2>
//       {profileData ? (
//         <div>
//           <p>Username: {profileData.username}</p>
//           <p>Full Name: {profileData.fullName}</p>
//           <p>Branch: {profileData.branch}</p>
//           <p>Year: {profileData.year}</p>
//         </div>
//       ) : (
//         <p>Loading profile data...</p>
//       )}
//     </div>
//   );
// }

// export default UserProfile;

//not working
