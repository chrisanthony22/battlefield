import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Menu/Navbar';
import ObjViewer from './ObjViewer/ObjViewer';
import RegisterForm from './Registration/RegisterForm'; // adjust path as needed

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: "#0D1117", width: "100vw" }}>
          <Routes>
            <Route path="/" element={<ObjViewer />} />
            <Route path="/register" element={<RegisterForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
