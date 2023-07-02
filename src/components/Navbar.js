import React from 'react'
import { Link } from 'react-router-dom';
import './styles/Navbar.css'

function Navbar() {
  return (
    <div className='Navbar'>
        <Link to="/feed">Feed</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/chats">Chats</Link>
    </div>
  )
}

export default Navbar;