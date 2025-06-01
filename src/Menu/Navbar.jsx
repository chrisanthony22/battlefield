import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState('left');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false); // Popup state

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
    setIsOpen(false);
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

  // Popup handlers
  const openPopup = () => setPopupOpen(true);
  const closePopup = () => setPopupOpen(false);

  return (
    <nav className="navbar">
      <div 
        className="logo tron" 
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        onClick={openPopup}
      >
        <img
          src="/ares64.png"
          alt="Ares Icon"
          style={{
            width: '30px',
            height: '30px',
            marginRight: '8px',
            backgroundColor: 'black',
            padding: '2px',
            borderRadius: '20px',
            filter: 'drop-shadow(0 0 3px #ff8000) drop-shadow(0 0 6px #ff5500)'
          }}
        />
        The BattleField
      </div>

      <div className={`menu ${isOpen ? 'open' : ''}`}>
        <Link to="/" onClick={closeAllMenus}>Home</Link>
        <Link to="/dashboard" onClick={closeAllMenus}>Game Dashboard</Link>
        <Link to="/about" onClick={closeAllMenus}>About</Link>
        <Link to="/rules" onClick={closeAllMenus}>Rules</Link>
        <Link to="/moderator" onClick={closeAllMenus}>Chat Moderator</Link>
        <Link to="/register" onClick={closeAllMenus}>Register</Link>
        <Link to="/chat" onClick={closeAllMenus}>Chats</Link>
        <Link to="/teams" onClick={closeAllMenus}>Registered Teams</Link>

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

      {popupOpen && (
        <div
          onClick={closePopup}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            cursor: 'pointer',
            color: '#ff8000',
            fontFamily: "'Orbitron', sans-serif",  // example neon/tron style font, change as needed
            textShadow: '0 0 5px #ff8000, 0 0 10px #ff5500',
            userSelect: 'none',
            padding: '20px',
          }}
        >
          <img
            src="/ares128.png"
            alt="Ares Large Icon"
            style={{
              width: '128px',
              height: '128px',
              backgroundColor: 'black',
              padding: '10px',
              borderRadius: '30px',
              filter: 'drop-shadow(0 0 8px #ff8000) drop-shadow(0 0 12px #ff5500)',
              cursor: 'default',
            }}
            onClick={e => e.stopPropagation()}
          />
          <div
            onClick={e => e.stopPropagation()}
            style={{
              marginTop: '0px',
              fontSize: '24px',
              fontWeight: 'bold',
              letterSpacing: '2px',
            }}
          >
            <h3 className='logo tron'>The BattleField</h3>
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
