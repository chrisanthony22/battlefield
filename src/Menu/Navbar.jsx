import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState('left');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();
  const userDropdownRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleDropdown = () => {
    if (!dropdownOpen && userDropdownRef.current) {
      const rect = userDropdownRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      if (rect.left + 150 > viewportWidth) {
        setDropdownPosition('right');
      } else {
        setDropdownPosition('left');
      }
    }
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const closeAllMenus = () => {
    closeDropdown();
    setIsOpen(false); // closes mobile burger menu if needed
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    window.dispatchEvent(new Event("userLoggedOut"));
    navigate("/");
    closeAllMenus();
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
        <Link to="/" onClick={closeAllMenus}>Home</Link>
        <Link to="/dashboard" onClick={closeAllMenus}>Game Dashboard</Link>
        <Link to="/about" onClick={closeAllMenus}>About</Link>
        <Link to="/rules" onClick={closeAllMenus}>Rules</Link>
        <Link to="/moderator" onClick={closeAllMenus}>Chat Moderator</Link>
        <Link to="/register" onClick={closeAllMenus}>Register</Link>

        {loggedInUser && (
          <div
            className="user-dropdown neon"
            onClick={toggleDropdown}
            ref={userDropdownRef}
            tabIndex={0}
          >
            [<FaUser className="user-icon" />- {loggedInUser.username}]
            {dropdownOpen && (
              <div className={`dropdown-menu dropdown-${dropdownPosition}`}>
                <Link to="/profile" onClick={closeAllMenus}>Profile</Link>
                <Link to="/settings" onClick={closeAllMenus}>Settings</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
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
