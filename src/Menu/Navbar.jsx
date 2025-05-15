import React, { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleLinkClick = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="logo tron">The BattleField</div>
      <div className={`menu ${isOpen ? 'open' : ''}`}>
        <Link to="/" onClick={handleLinkClick}>Home</Link>
        <Link to="/dashboard" onClick={handleLinkClick}>Game Dashboard</Link>
        <Link to="/about" onClick={handleLinkClick}>About</Link>
        <Link to="/rules" onClick={handleLinkClick}>Rules</Link>
        <Link to="/moderator" onClick={handleLinkClick}>Chat Moderator</Link>
        <Link to="/register" onClick={handleLinkClick}>Register</Link> {/* 👈 New link */}
      </div>
      <div className="burger" onClick={toggleMenu}>
        <div className="line" />
        <div className="line" />
        <div className="line" />
      </div>
    </nav>
  );
};

export default Navbar;
