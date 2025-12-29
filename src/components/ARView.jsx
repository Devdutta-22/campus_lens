import React, { useRef, useState } from 'react';
import { Button, Card, Typography } from '@mui/material';

const ARView = ({ modelSrc, note }) => {
  const modelRef = useRef(null);
  const [arStatus, setArStatus] = useState("Scan floor to place");

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      
      {/* THE GOOGLE AR COMPONENT */}
      <model-viewer
        ref={modelRef}
        src={modelSrc} 
        ar 
        ar-modes="webxr scene-viewer quick-look" 
        camera-controls 
        auto-rotate
        shadow-intensity="1"
        style={{ width: '100%', height: '100%' }}
      >
        {/* This button appears ONLY on AR-capable phones */}
        <button slot="ar-button" style={{
            position: 'absolute', bottom: '20px', left: '50%', transform: 'translate(-50%)',
            backgroundColor: '#4285F4', color: 'white', border: 'none', borderRadius: '24px',
            padding: '12px 24px', fontSize: '16px', fontWeight: 'bold'
        }}>
          👋 Place in Real World
        </button>

        {/* The "Note" floating above the object */}
        <div slot="hotspot-note" 
             data-surface="0 0 1" 
             style={{ background: 'white', padding: '10px', borderRadius: '8px', width: '200px' }}>
             <Typography variant="body2"><b>Gemini Tip:</b> {note}</Typography>
        </div>
      </model-viewer>

    </div>
  );
};

export default ARView;