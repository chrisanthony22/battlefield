import React from 'react';
import Navbar from './Menu/Navbar';
import ObjViewer from './ObjViewer/ObjViewer';

function App() {
  return (
    <>
    {/*
      <Navbar />
      <h3 className='tron'>
          The BattleField is calling your warrior team! Grind and Earn by defeating other teams!</h3>
          */}
          <h3 className='tron'>
          The Text here is placed!</h3>
      <div style={{ padding: '20px',display:'flex',justifyContent:'center',alignItems:'center' }}>
        
          <div style={{background:"#0D1117",width:"100vw"}}>
            <ObjViewer />;
          </div>
          
      </div>
    </>
  );
}

export default App;