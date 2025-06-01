import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Menu/Navbar';
import ObjViewer from './ObjViewer/ObjViewer';
import RegisterForm from './Registration/RegisterForm';
import ChatListPage from './components/ChatListPage';
import TeamsList from './components/TeamsList';
import InstallPrompt from './InstallPrompt'; // 👈 Import here

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:'30px' }}>
        <div style={{ background: "#0D1117", width: "100vw" }}>
          <Routes>
            <Route path="/" element={<ObjViewer />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/chat" element={<ChatListPage />} />
            <Route path="/teams" element={<TeamsList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
