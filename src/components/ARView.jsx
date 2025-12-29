import React, { useState } from 'react';
import Webcam from 'react-webcam';
import { Button, Typography, Box } from '@mui/material';

const ARView = ({ modelSrc, note, distance }) => {
  const [revealed, setRevealed] = useState(false);

  // 🎯 "Hot/Cold" Game Logic
  // If distance < 20m, Magic is "High". Otherwise "Weak".
  // (If distance is null, we assume 'Searching...')
  const magicLevel = distance && distance < 20 ? "HIGH" : "WEAK";
  const canReveal = magicLevel === "HIGH";

  const videoConstraints = {
    facingMode: "environment" // Forces back camera on mobile
  };

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', background: 'black' }}>
      
      {/* 1. 📸 THE LIVE CAMERA FEED (Background) */}
      <Webcam
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover', // Fills screen like a real app
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0
        }}
      />

      {/* 2. 🪄 HUD OVERLAY (The "Revelio" UI) */}
      {!revealed && (
        <Box sx={{
          position: 'absolute', bottom: 100, left: 0, right: 0, 
          textAlign: 'center', zIndex: 10,
          color: 'white', textShadow: '0 0 10px black'
        }}>
          {/* Magic Meter */}
          <Typography variant="h5" sx={{fontWeight: 'bold', color: canReveal ? '#FFD700' : '#00e5ff'}}>
            Magic Energy: {magicLevel}
          </Typography>
          <Typography variant="caption">
            {distance ? `${Math.round(distance)} meters away` : "Scanning..."}
          </Typography>

          {/* REVELIO BUTTON */}
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="contained"
              disabled={!canReveal} // Locked if too far
              onClick={() => setRevealed(true)}
              sx={{
                borderRadius: '50%', width: 80, height: 80,
                fontSize: '12px', fontWeight: 'bold',
                backgroundColor: canReveal ? '#FFD700' : 'rgba(128,128,128,0.5)',
                color: 'black', border: '2px solid white',
                boxShadow: canReveal ? '0 0 20px #FFD700' : 'none'
              }}
            >
              CAST<br/>REVELIO
            </Button>
          </Box>
        </Box>
      )}

      {/* 3. 📦 THE REVEAL (3D Object appears ON TOP of Camera) */}
      {revealed && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', 
          transform: 'translate(-50%, -50%)',
          width: '300px', height: '400px', zIndex: 20
        }}>
          {/* The 3D Model */}
          <model-viewer
            src={modelSrc} 
            auto-rotate
            camera-controls
            shadow-intensity="1"
            style={{ width: '100%', height: '100%' }}
          />
          
          {/* The Secret Message */}
          <div style={{
            background: 'rgba(0,0,0,0.8)', padding: '15px', 
            borderRadius: '10px', color: '#FFD700', textAlign: 'center',
            border: '1px solid #FFD700', marginTop: '-50px', position: 'relative'
          }}>
            <Typography variant="h6">Artifact Found!</Typography>
            <Typography variant="body1">"{note}"</Typography>
            <Button size="small" onClick={() => setRevealed(false)} sx={{color: 'white', mt: 1}}>
              Close
            </Button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ARView;