// src/InstallPrompt.js
import React, { useEffect, useState } from 'react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installSupported, setInstallSupported] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); // Prevent default mini-infobar
      setDeferredPrompt(e);
      setInstallSupported(true); // Mark as installable
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    } else {
      alert('Install not supported on this browser or already installed.');
    }
  };

  return (
    <div style={{ textAlign: 'right', margin: '5px 5px 0px 0px', color:'white' }}>
        For hussle free access - 
      <button
        onClick={handleInstallClick}
        style={{
          padding: '10px 20px',
          fontSize: '14px',
          background: '#00f0ff',
          color: '#000',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          opacity: installSupported ? 1 : 0.6,
        }}
      >
        Install App
      </button>
    </div>
  );
};

export default InstallPrompt;
