import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleLinkClick = () => setIsOpen(false); // closes menu on link click

  return (
    <nav className="navbar">
      <div className="logo tron">The BattleField</div>
      <div className={`menu ${isOpen ? 'open' : ''}`}>
        <a href="#" onClick={handleLinkClick}>Home</a>
        <a href="#" onClick={handleLinkClick}>Game Dashboard</a>
        <a href="#" onClick={handleLinkClick}>About</a>
        <a href="#" onClick={handleLinkClick}>Rules</a>
        <a href="#" onClick={handleLinkClick}>Chat Moderator</a>
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
