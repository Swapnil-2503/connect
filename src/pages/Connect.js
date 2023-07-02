import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import Navbar from '../components/Navbar'
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import './styles/Connect.css';

function Connect() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Fetch all users from Firebase Firestore
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await firebase.firestore().collection('users').get();
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Perform search logic when searchQuery changes
    const searchUsers = () => {
      if (searchQuery.trim() !== '') {
        const filteredUsers = users.filter((user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredUsers);
      } else {
        setSearchResults([]);
      }
    };

    searchUsers();
  }, [searchQuery, users]);

  useEffect(() => {
    // Listen for new messages in the current chat conversation
    if (currentChatId) {
      const chatRef = firebase.firestore().collection('chats').doc(currentChatId);

      const unsubscribe = chatRef.onSnapshot((snapshot) => {
        const chatData = snapshot.data();
        if (chatData) {
          setChatHistory(chatData.messages);
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [currentChatId]);

  useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      console.log('Current user:', user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Perform search logic here based on searchQuery
    const filteredUsers = users.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())&& user.id !== currentUser.uid
    );
    setSearchResults(filteredUsers);
  };

  const handleChatUserClick = async (user) => {
    setCurrentChatUser(user);

    try {
      const chatRef = firebase.firestore().collection('chats');
      const chatSnapshot = await chatRef
        .where('participants', 'in', [[currentUser.uid, user.id], [user.id, currentUser.uid]])
        .get();

      if (chatSnapshot.empty) {
        // Create a new chat document
        const newChatDoc = await chatRef.add({
          participants: [currentUser.uid, user.id],
          messages: [],
        });
        const newChatId = newChatDoc.id;
        setCurrentChatId(newChatId);
        console.log('New chat ID:', newChatId);
      } else {
        // Retrieve the existing chat document
        const existingChatId = chatSnapshot.docs[0].id;
        setCurrentChatId(existingChatId);
        console.log('Existing chat ID:', existingChatId);
      }
    } catch (error) {
      console.error('Error fetching or creating chat:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') {
      return;
    }

    try {
      setIsSending(true);
      const chatRef = firebase.firestore().collection('chats').doc(currentChatId);
      const chatSnapshot = await chatRef.get();
      const chatData = chatSnapshot.data();

      if (chatData) {
        const newMessageData = {
          senderId: currentUser.uid,
          message: newMessage,
          timestamp: new Date().toISOString(),
        };
        chatData.messages.push(newMessageData);
        await chatRef.update({
          messages: chatData.messages,
        });
        setNewMessage('');
        setIsSending(false);
        console.log('Message sent:', newMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsSending(false);
    }
  };

  return (
    <div className="connect-container">
      <Navbar/>
      <div className="sidebar">
        <h2>Users</h2>
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search users"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button type="submit">Search</button>
        </form>
        <ul className="user-list">
  {searchResults.map((user) => {
    if (user.id !== currentUser.uid) {
      return (
        <li
          key={user.id}
          className={currentChatUser && currentChatUser.id === user.id ? 'active' : ''}
          onClick={() => handleChatUserClick(user)}
        >
          {user.username}
        </li>
      );
    }
    return null;
  })}
</ul>
      </div>
      <div className="chat-container">
        {currentChatUser ? (
          <div className="chat-header">
            <h3>Chatting with: {currentChatUser.username}</h3>
          </div>
        ) : (
          <div className="chat-header">
            <h3>No user selected</h3>
          </div>
        )}
        <div className="chat-history">
          {chatHistory.map((message) => (
            <div
              key={message.timestamp}
              className={message.senderId === currentUser.uid ? 'message sent' : 'message received'}
            >
              {message.message}
              <div className="message-timestamp">{new Date(message.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>
        {currentChatUser && (
          <form className="message-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type your message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" disabled={isSending}>
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Connect;
