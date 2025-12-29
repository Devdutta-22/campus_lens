import React, { useState, useEffect } from 'react';
import MapRadar from './components/MapRadar';
import ARView from './components/ARView';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

function App() {
  const [mode, setMode] = useState('MAP'); // 'MAP' or 'AR'
  const [drops, setDrops] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDrop, setSelectedDrop] = useState(null);

  // 1. 🛰️ Get Live GPS Location
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error("GPS Error:", err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // 2. 📥 Fetch Drops from Firebase
  const fetchDrops = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "campus_drops"));
      const dropsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDrops(dropsList);
    } catch (e) {
      console.error("Error fetching drops:", e);
    }
  };

  useEffect(() => { fetchDrops(); }, []);

  // 3. ➕ "Drop" Logic (Save to DB)
  const handleDropObject = async () => {
    if (!userLocation) {
      alert("⚠️ Waiting for GPS... Stand outside!");
      return;
    }

    const message = prompt("💬 What is the secret message for this spot?");
    if (!message) return;

    await addDoc(collection(db, "campus_drops"), {
      latitude: userLocation.lat,
      longitude: userLocation.lng,
      message: message,
      modelType: "book", 
      timestamp: Date.now()
    });
    
    alert("✅ Object Dropped! It is now on the map.");
    fetchDrops(); 
  };

  // 4. 🔓 "Unlock" Logic (Distance Check)
  const handleMarkerClick = (drop) => {
    if (!userLocation) return;
    
    // Calculate distance in meters (Haversine Formula)
    const R = 6371e3; 
    const φ1 = userLocation.lat * Math.PI/180;
    const φ2 = drop.latitude * Math.PI/180;
    const Δφ = (drop.latitude - userLocation.lat) * Math.PI/180;
    const Δλ = (drop.longitude - userLocation.lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; 

    // UNLOCK DISTANCE: 30 Meters
    if (distance < 30) { 
      alert("🎉 You found it! Opening AR Camera...");
      setSelectedDrop(drop);
      setMode('AR');
    } else {
      alert(`🔒 Too far! Walk ${Math.round(distance)}m closer to unlock.`);
    }
  };

  if (mode === 'AR') {
    return (
      <>
        <button 
          onClick={() => setMode('MAP')} 
          style={{
            position:'absolute', top:20, left:20, zIndex:999,
            padding: '10px 20px', background: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold'
          }}>
          🔙 Back to Map
        </button>
        <ARView modelSrc="/assets/book_model.glb" note={selectedDrop?.message} />
      </>
    );
  }

  return (
    <MapRadar 
      drops={drops} 
      userLocation={userLocation} 
      onEnterAR={handleMarkerClick} 
      onDropObject={handleDropObject}
    />
  );
}

export default App;