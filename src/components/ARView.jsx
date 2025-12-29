import React, { useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button, Typography, Box, CircularProgress } from '@mui/material';

const ARView = ({ modelSrc, note, distance }) => {
  const [revealed, setRevealed] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🎯 Game Logic: Unlock at 20 meters
  const magicLevel = distance && distance < 20 ? "HIGH" : "WEAK";
  const canReveal = magicLevel === "HIGH";

  // 🛠️ Camera Error Handler (Permissions or Hardware)
  const handleUserMediaError = useCallback((error) => {
    console.error("Camera Error:", error);
    setCameraError("⚠️ Camera Access Denied. Check permissions!");
    setIsLoading(false);
  }, []);

  const handleUserMedia = () => {
    console.log("✅ Camera Loaded Successfully");
    setIsLoading(false);
  };

  const videoConstraints = {
    facingMode: { ideal: "environment" } // "ideal" is safer than strict "environment"
  };

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', background: 'black', overflow: 'hidden' }}>
      
      {/* 1. 📸 LIVE CAMERA FEED */}
      {!cameraError && (
        <Webcam
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          onUserMedia={handleUserMedia}
          onUserMediaError={handleUserMediaError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0, 
            left: 0,
            zIndex: 0,
            opacity: revealed ? 0.3 : 1 // Dim camera when object is revealed
          }}
        />
      )}

      {/* 2. ⏳ LOADING / ERROR STATE */}
      {(isLoading || cameraError) && (
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          textAlign: 'center', color: 'white', zIndex: 5
        }}>
          {cameraError ? (
            <>
              <Typography variant="h5" color="error" sx={{mb: 2}}>{cameraError}</Typography>
              <Typography variant="body2">
                1. Tap the Lock 🔒 icon in the URL bar.<br/>
                2. Click "Permissions" -> Enable Camera.<br/>
                3. Refresh the page.
              </Typography>
            </>
          ) : (
            <>
              <CircularProgress sx={{color: '#FFD700'}} />
              <Typography sx={{mt: 2, fontFamily: 'Cinzel'}}>Initiating Lens...</Typography>
            </>
          )}
        </Box>
      )}

      {/* 3. 🪄 HUD OVERLAY (The "Revelio" Interface) */}
      {!revealed && !cameraError && !isLoading && (
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
              disabled={!canReveal} 
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

      {/* 4. 📦 THE AR REVEAL */}
      {revealed && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', 
          transform: 'translate(-50%, -50%)',
          width: '100%', height: '100%', zIndex: 20,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          {/* Close Button */}
          <Button 
            onClick={() => setRevealed(false)} 
            sx={{position: 'absolute', top: 20, right: 20, color: 'white', border: '1px solid white'}}
          >
            Close Vision
          </Button>

          {/* The 3D Model */}
          <div style={{width: '300px', height: '400px', position: 'relative'}}>
             <model-viewer
              src={modelSrc} 
              auto-rotate
              camera-controls
              shadow-intensity="1"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          
          {/* The Message */}
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