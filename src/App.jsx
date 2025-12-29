import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, BottomNavigation, BottomNavigationAction, Paper, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import CameraIcon from '@mui/icons-material/CameraAlt';
import AutoStoriesIcon from '@mui/icons-material/AutoStories'; 
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { magicTheme } from './theme';

// 🧩 Components
import HomePage from './components/HomePage'; 
import MagicMap from './components/MagicMap'; 
import ARView from './components/ARView'; 

// 🔥 Firebase
import { db } from './firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';

function App() {
  const [currentTab, setCurrentTab] = useState(0); // 0=Home, 1=Map, 2=Lens, 3=Journal
  const [userLocation, setUserLocation] = useState(null);
  const [drops, setDrops] = useState([]);
  
  // 🎮 Game State
  const [selectedDrop, setSelectedDrop] = useState(null);
  const [distanceToDrop, setDistanceToDrop] = useState(null);
  const [mapCenter, setMapCenter] = useState(null); // For Teleporting

  // 1. 📐 Distance Math (Haversine)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; 
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2 - lat1) * Math.PI/180;
    const Δλ = (lon2 - lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Meters
  };

  // 2. 🛰️ GPS Tracker
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(newLoc);
        
        // Live Update Distance to Target
        if (selectedDrop) {
          const dist = calculateDistance(newLoc.lat, newLoc.lng, selectedDrop.latitude, selectedDrop.longitude);
          setDistanceToDrop(dist);
        }
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [selectedDrop]);

  // 3. 📥 Fetch Artifacts
  const fetchDrops = async () => {
    try {
      const s = await getDocs(collection(db, "campus_drops"));
      setDrops(s.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch(e) { console.error(e); }
  };
  useEffect(() => { fetchDrops(); }, []);

  // 4. 🖱️ Actions
  const handleTeleport = (coords) => {
    setMapCenter(coords); // Tell Map where to look
    setCurrentTab(1);     // Switch to Map Tab
  };

  const handleMarkerClick = (drop) => {
    setSelectedDrop(drop);
    setCurrentTab(2); // Jump directly to Lens to find it
    if (userLocation) {
      setDistanceToDrop(calculateDistance(userLocation.lat, userLocation.lng, drop.latitude, drop.longitude));
    }
  };

  const handleAddArtifact = async () => {
    if (!userLocation) return alert("Wait for GPS lock!");
    const msg = prompt("Leave a message for this spot:");
    if (!msg) return;
    
    await addDoc(collection(db, "campus_drops"), {
      latitude: userLocation.lat,
      longitude: userLocation.lng,
      message: msg,
      type: "poster", 
      timestamp: Date.now()
    });
    fetchDrops();
    alert("✨ Artifact placed for others to find!");
  };

  return (
    <ThemeProvider theme={magicTheme}>
      <CssBaseline />
      
      {/* 📱 APP CONTENT AREA */}
      <div style={{ height: '100vh', paddingBottom: '56px', overflow: 'hidden' }}>
        
        {/* TAB 0: HOME DASHBOARD */}
        {currentTab === 0 && (
          <HomePage onTeleport={handleTeleport} />
        )}

        {/* TAB 1: MAGIC MAP */}
        {currentTab === 1 && (
          <>
            <MagicMap 
              drops={drops} 
              userLocation={userLocation} 
              onMarkerClick={handleMarkerClick}
              forcedCenter={mapCenter}
            />
            {/* FAB: Drop Button */}
            <IconButton 
              onClick={handleAddArtifact}
              sx={{
                position: 'absolute', top: 20, right: 20, 
                backgroundColor: 'rgba(255, 215, 0, 0.9)', color: 'black',
                '&:hover': { backgroundColor: '#FFD700' },
                width: 60, height: 60, zIndex: 1000,
                boxShadow: '0 0 15px #FFD700'
              }}
            >
              <AddCircleIcon sx={{fontSize: 35}} />
            </IconButton>
          </>
        )}

        {/* TAB 2: LENS (NATIVE CAMERA) */}
        {currentTab === 2 && (
          <ARView 
            modelSrc="/assets/book_model.glb" 
            note={selectedDrop ? selectedDrop.message : "Find a marker on the map!"} 
            distance={distanceToDrop} 
          />
        )}

        {/* TAB 3: JOURNAL */}
        {currentTab === 3 && (
          <div style={{padding: 20, textAlign: 'center', paddingTop: 80, overflowY: 'auto', height: '100%'}}>
            <h2 style={{fontFamily: 'Cinzel', color: '#FFD700', textShadow: '0 0 10px #FFD700'}}>Field Guide</h2>
            <p style={{color: '#aaa'}}>Artifacts Found: 0/{drops.length}</p>
            {drops.map(d => (
                <Paper key={d.id} sx={{p: 2, mt: 2, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(5px)'}}>
                    <div style={{color: '#FFD700', fontSize: '12px'}}>✨ Artifact</div>
                    "{d.message}"
                </Paper>
            ))}
          </div>
        )}

      </div>

      {/* 🧭 BOTTOM NAVIGATION */}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2000 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={currentTab}
          onChange={(event, newValue) => setCurrentTab(newValue)}
          sx={{ 
            background: 'rgba(10, 15, 30, 0.95)', 
            backdropFilter: 'blur(10px)', 
            borderTop: '1px solid rgba(255, 215, 0, 0.3)' 
          }}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Map" icon={<MapIcon />} />
          <BottomNavigationAction label="Lens" icon={<CameraIcon />} />
          <BottomNavigationAction label="Journal" icon={<AutoStoriesIcon />} />
        </BottomNavigation>
      </Paper>

    </ThemeProvider>
  );
}

export default App;