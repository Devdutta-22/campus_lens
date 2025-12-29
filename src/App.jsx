import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, BottomNavigation, BottomNavigationAction, Paper, IconButton } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import CameraIcon from '@mui/icons-material/CameraAlt';
import AutoStoriesIcon from '@mui/icons-material/AutoStories'; 
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { magicTheme } from './theme';
import MagicMap from './components/MagicMap';
import ARView from './components/ARView'; 
import { db } from './firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';

function App() {
  const [currentTab, setCurrentTab] = useState(0); 
  const [userLocation, setUserLocation] = useState(null);
  const [drops, setDrops] = useState([]);
  
  // 🔧 RESTORED LOGIC: Selection & Distance
  const [selectedDrop, setSelectedDrop] = useState(null);
  const [distanceToDrop, setDistanceToDrop] = useState(null);

  // 1. 📐 Distance Calculation (Haversine Formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2 - lat1) * Math.PI/180;
    const Δλ = (lon2 - lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
  };

  // 2. 🛰️ GPS Tracker
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(newLoc);

        // 🔄 Live Update Distance if a target is selected
        if (selectedDrop) {
          const dist = calculateDistance(
            newLoc.lat, newLoc.lng, 
            selectedDrop.latitude, selectedDrop.longitude
          );
          setDistanceToDrop(dist);
        }
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [selectedDrop]); // Re-run when selectedDrop changes

  // 3. 📥 Load Artifacts
  const fetchDrops = async () => {
    try {
      const s = await getDocs(collection(db, "campus_drops"));
      setDrops(s.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch(e) { console.error(e); }
  };
  useEffect(() => { fetchDrops(); }, []);

  // 4. 🖱️ Handle Marker Click
  const handleMarkerClick = (drop) => {
    setSelectedDrop(drop);
    // Switch to Lens tab immediately to start the hunt
    setCurrentTab(1); 
    
    // Calculate initial distance
    if (userLocation) {
      setDistanceToDrop(calculateDistance(
        userLocation.lat, userLocation.lng, 
        drop.latitude, drop.longitude
      ));
    }
  };

  // 5. ➕ Add New Artifact
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
    alert("✨ Artifact placed!");
  };

  return (
    <ThemeProvider theme={magicTheme}>
      <CssBaseline />
      
      <div style={{ height: '100vh', paddingBottom: '56px' }}>
        
        {/* TAB 0: MAP */}
        {currentTab === 0 && (
          <>
            <MagicMap 
              drops={drops} 
              userLocation={userLocation} 
              onMarkerClick={handleMarkerClick} 
            />
            <IconButton 
              onClick={handleAddArtifact}
              sx={{
                position: 'absolute', top: 20, right: 20, 
                backgroundColor: 'rgba(255, 215, 0, 0.8)', color: 'black',
                '&:hover': { backgroundColor: '#FFD700' },
                width: 60, height: 60, zIndex: 1000
              }}
            >
              <AddCircleIcon sx={{fontSize: 40}} />
            </IconButton>
          </>
        )}

        {/* TAB 1: LENS (Camera) */}
        {currentTab === 1 && (
          <ARView 
            modelSrc="/assets/book_model.glb" 
            // 🛠️ FIX: Now these variables exist!
            note={selectedDrop ? selectedDrop.message : "Find a marker on the map first!"} 
            distance={distanceToDrop} 
          />
        )}

        {/* TAB 2: JOURNAL */}
        {currentTab === 2 && (
          <div style={{padding: 20, textAlign: 'center', paddingTop: 100}}>
            <h2 style={{fontFamily: 'Cinzel', color: '#FFD700'}}>Field Guide</h2>
            <p style={{color: '#aaa'}}>Artifacts Collected: 0/{drops.length}</p>
            {drops.map(d => (
                <Paper key={d.id} sx={{p: 2, mt: 2, background: 'rgba(255,255,255,0.1)'}}>
                    {d.message}
                </Paper>
            ))}
          </div>
        )}

      </div>

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