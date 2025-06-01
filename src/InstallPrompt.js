import React, { useEffect, useState } from 'react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(outcome === 'accepted' ? '✅ Installed' : '❌ Cancelled');
      setDeferredPrompt(null);
    } else {
      // fallback message for unsupported browsers (e.g., iOS Safari)
      alert(
        "Installation not supported automatically.\n\n" +
        "On iOS: tap the Share button and choose 'Add to Home Screen'.\n" +
        "On Android Chrome: use the browser menu and choose 'Add to Home screen'."
      );
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '10px' }}>
      <button
        onClick={handleInstallClick}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#00f0ff',
          color: '#000',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Install App
      </button>
    </div>
  );
};

export default InstallPrompt;
