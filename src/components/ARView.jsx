import React, { useState, useEffect, useRef } from 'react';
import { Button, Typography, Box, CircularProgress } from '@mui/material';

const ARView = ({ modelSrc, note, distance }) => {
  const [revealed, setRevealed] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const videoRef = useRef(null);

  // 🎯 Game Logic: Unlock at 20 meters
  const magicLevel = distance && distance < 20 ? "HIGH" : "WEAK";
  const canReveal = magicLevel === "HIGH";

  // 📸 Native Camera Logic
  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      try {
        // Request the back camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setPermissionGranted(true);
        }
      } catch (err) {
        console.error("Camera Error:", err);
        alert("Camera failed to load. Please allow permissions in your browser settings.");
      }
    };

    startCamera();

    // Cleanup: Turn off camera when leaving this tab
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', background: 'black', overflow: 'hidden' }}>
      
      {/* 1. 📸 NATIVE VIDEO FEED */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0, left: 0,
          zIndex: 0,
          opacity: revealed ? 0.3 : 1
        }}
      />

      {/* 2. ⏳ LOADING STATE (If camera isn't ready) */}
      {!permissionGranted && (
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          textAlign: 'center', color: 'white', zIndex: 5
        }}>
          <CircularProgress sx={{color: '#FFD700'}} />
          <Typography sx={{mt: 2, fontFamily: 'Cinzel'}}>Requesting Vision...</Typography>
        </Box>
      )}

      {/* 3. 🪄 HUD OVERLAY (The "Revelio" Interface) */}
      {!revealed && permissionGranted && (
        <Box sx={{
          position: 'absolute', bottom: 120, left: 0, right: 0, 
          textAlign: 'center', zIndex: 10,
          color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.8)'
        }}>
          <Typography variant="h5" sx={{
            fontFamily: 'Cinzel', fontWeight: 'bold', 
            color: canReveal ? '#FFD700' : 'rgba(255,255,255,0.7)',
            animation: canReveal ? 'pulse-gold 2s infinite' : 'none'
          }}>
            Magic Energy: {magicLevel}
          </Typography>
          
          <Typography variant="body2" sx={{opacity: 0.8, mt: 1}}>
            {distance ? `${Math.round(distance)} meters to target` : "Scanning area..."}
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Button 
              variant="contained"
              disabled={!canReveal} // 🔒 Locked until 20m
              onClick={() => setRevealed(true)}
              sx={{
                borderRadius: '50%', width: 90, height: 90,
                fontSize: '12px', fontWeight: 'bold', fontFamily: 'Cinzel',
                backgroundColor: canReveal ? '#FFD700' : 'rgba(50,50,50,0.5)',
                color: canReveal ? 'black' : 'rgba(255,255,255,0.3)', 
                border: canReveal ? '3px solid white' : '1px solid grey',
                boxShadow: canReveal ? '0 0 30px #FFD700' : 'none'
              }}
            >
              CAST<br/>REVELIO
            </Button>
          </Box>
        </Box>
      )}

      {/* 4. 📦 THE REVEAL */}
      {revealed && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', 
          transform: 'translate(-50%, -50%)',
          width: '100%', height: '100%', zIndex: 20,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <Button 
            onClick={() => setRevealed(false)} 
            sx={{position: 'absolute', top: 20, right: 20, color: 'white', border: '1px solid white'}}
          >
            Close Vision
          </Button>

          <div style={{width: '300px', height: '400px', position: 'relative'}}>
             <model-viewer
              src={modelSrc} 
              auto-rotate
              camera-controls
              shadow-intensity="1"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          
          <div style={{
            background: 'rgba(10, 15, 30, 0.9)', padding: '20px', 
            borderRadius: '16px', color: '#FFD700', textAlign: 'center',
            border: '1px solid #FFD700', maxWidth: '80%',
            backdropFilter: 'blur(10px)', boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
          }}>
            <Typography variant="h6" sx={{fontFamily: 'Cinzel'}}>Artifact Uncovered!</Typography>
            <Typography variant="body1" sx={{color: 'white', mt: 1}}>"{note}"</Typography>
          </div>
        </div>
      )}

    </div>
  );
};

export default ARView;