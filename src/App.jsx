import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import CameraIcon from '@mui/icons-material/CameraAlt';
import AutoStoriesIcon from '@mui/icons-material/AutoStories'; // Journal Icon
import { magicTheme } from './theme';
import MagicMap from './components/MagicMap';
import ARView from './components/ARView'; // Re-using your existing component
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

function App() {
  const [currentTab, setCurrentTab] = useState(0); // 0=Map, 1=Lens, 2=Journal
  const [userLocation, setUserLocation] = useState(null);
  const [drops, setDrops] = useState([]);

  // 1. 🛰️ GPS Tracker
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // 2. 📥 Load Artifacts
  useEffect(() => {
    const fetchDrops = async () => {
      const s = await getDocs(collection(db, "campus_drops"));
      setDrops(s.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchDrops();
  }, []);

  return (
    <ThemeProvider theme={magicTheme}>
      <CssBaseline />
      
      {/* === SCREEN CONTENT === */}
      <div style={{ height: '100vh', paddingBottom: '56px' }}>
        
        {/* TAB 0: MARAUDER'S MAP */}
        {currentTab === 0 && (
          <MagicMap drops={drops} userLocation={userLocation} onMarkerClick={() => setCurrentTab(1)} />
        )}

        {/* TAB 1: THE LENS (AR) */}
        {currentTab === 1 && (
          <ARView modelSrc="/assets/book_model.glb" note="Magic Detected..." />
        )}

        {/* TAB 2: JOURNAL (Placeholder for now) */}
        {currentTab === 2 && (
          <div style={{padding: 20, textAlign: 'center', paddingTop: 100}}>
            <h2 style={{fontFamily: 'Cinzel', color: '#FFD700'}}>Field Guide</h2>
            <p>Artifacts Collected: 0/10</p>
          </div>
        )}

      </div>

      {/* === BOTTOM NAV (Glass Effect) === */}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={currentTab}
          onChange={(event, newValue) => setCurrentTab(newValue)}
          sx={{
            background: 'rgba(10, 15, 30, 0.9)', 
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid #333'
          }}
        >
          <BottomNavigationAction label="Map" icon={<MapIcon />} />
          <BottomNavigationAction label="Lens" icon={<CameraIcon />} />
          <BottomNavigationAction label="Journal" icon={<AutoStoriesIcon />} />
        </BottomNavigation>
      </Paper>

    </ThemeProvider>
  );
}

export default App;