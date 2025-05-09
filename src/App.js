import React from 'react';
import Navbar from './Menu/Navbar';
import ObjViewer from './ObjViewer/ObjViewer';

function App() {
  return (
    <>
      <Navbar />
      <h3 className='tron'>
          The BattleField is calling your warrior team! Grind and Earn by defeating other teams!</h3>
      <div style={{ padding: '20px',display:'flex',justifyContent:'center',alignItems:'center' }}>
        
          <div style={{background:"black",width:"50%"}}>
            <ObjViewer />;
          </div>
          
      </div>
    </>
  );
}

export default App;