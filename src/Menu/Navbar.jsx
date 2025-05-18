import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState('left'); // new state
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  const userDropdownRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleDropdown = () => {
    if (!dropdownOpen && userDropdownRef.current) {
      // Check available space on right side of the dropdown trigger
      const rect = userDropdownRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

      if (rect.left + 150 > viewportWidth) {
        setDropdownPosition('right'); // Align dropdown to right
      } else {
        setDropdownPosition('left'); // Default: align left
      }
    }
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => setDropdownOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    window.dispatchEvent(new Event("userLoggedOut"));
    navigate("/");
  };

  useEffect(() => {
    const loadUser = () => {
      const userData = JSON.parse(localStorage.getItem("loggedInUser"));
      setLoggedInUser(userData);
    };

    loadUser();
    window.addEventListener("userLoggedIn", loadUser);
    window.addEventListener("userLoggedOut", loadUser);

    return () => {
      window.removeEventListener("userLoggedIn", loadUser);
      window.removeEventListener("userLoggedOut", loadUser);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="logo tron">The BattleField</div>
      <div className={`menu ${isOpen ? 'open' : ''}`}>
        <Link to="/" onClick={closeDropdown}>Home</Link>
        <Link to="/dashboard" onClick={closeDropdown}>Game Dashboard</Link>
        <Link to="/about" onClick={closeDropdown}>About</Link>
        <Link to="/rules" onClick={closeDropdown}>Rules</Link>
        <Link to="/moderator" onClick={closeDropdown}>Chat Moderator</Link>
        <Link to="/register" onClick={closeDropdown}>Register</Link>
        {loggedInUser && (
          <div
            className="user-dropdown neon"
            onClick={toggleDropdown}
            ref={userDropdownRef}
            tabIndex={0}
          >
           [<FaUser className="user-icon" />-
            {loggedInUser.username}
            {dropdownOpen && (
              <div className={`dropdown-menu dropdown-${dropdownPosition}`}>
                <Link to="/profile" onClick={closeDropdown}>Profile</Link>
                <Link to="/settings" onClick={closeDropdown}>Settings</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}]
          </div>
        )}
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
