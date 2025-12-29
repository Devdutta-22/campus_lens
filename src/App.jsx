import React, { useState, useEffect } from 'react';
import ARView from './components/ARView';
import { getCampusTip } from './utils/aiService';
import { Button, CircularProgress, Container, Typography } from '@mui/material';

// 📍 COORDINATES (Go to Google Maps -> Right Click -> Get Lat/Long)
const LOCATIONS = {
  LIBRARY: { lat: 28.364, long: 77.534, name: "Library" },
  LAB: { lat: 28.365, long: 77.535, name: "Innovation Lab" }
};

function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [aiTip, setAiTip] = useState("Loading tip...");
  const [loading, setLoading] = useState(false);

  // Function to spoof location for DEMO (Critical for Judges table!)
  const handleDevUnlock = async () => {
    setLoading(true);
    const tip = await getCampusTip("Library");
    setAiTip(tip);
    setUnlocked(true);
    setLoading(false);
  };

  if (unlocked) {
    // Show the AR Screen
    return <ARView modelSrc="/assets/book_model.glb" note={aiTip} />;
  }

  return (
    <Container style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>CampusLens 🔍</Typography>
      <Typography variant="body1" color="textSecondary">
        Walk to a campus hotspot to unlock AR notes.
      </Typography>

      <div style={{ marginTop: '40px' }}>
        {loading ? <CircularProgress /> : (
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleDevUnlock} // Use GPS logic here in real version
          >
            I am at the Library (Unlock)
          </Button>
        )}
      </div>
      
      <p style={{marginTop: '20px', fontSize: '12px', color: 'gray'}}>
        Powered by Google Gemini & WebXR
      </p>
    </Container>
  );
}

export default App;