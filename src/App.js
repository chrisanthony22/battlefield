import React from 'react';
import Navbar from './Menu/Navbar';
import ObjViewer from './ObjViewer/ObjViewer';

function App() {
  return (
    <>
    
      <Navbar />
      
        
      <div style={{ padding: '20px',display:'flex',justifyContent:'center',alignItems:'center' }}>
        
          <div style={{background:"#0D1117",width:"100vw"}}>
            <ObjViewer />;
          </div>
          
      </div>
    </>
  );
}

export default App;