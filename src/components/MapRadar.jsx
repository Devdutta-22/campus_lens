import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Button } from '@mui/material';

// ✅ SECURE METHOD: Read from Environment Variable
const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const MapRadar = ({ drops, userLocation, onEnterAR, onDropObject }) => {
  // Safety Check: If key is missing, show error in console
  if (!MAPS_API_KEY) {
    console.error("⚠️ Missing Google Maps API Key! Check your .env file.");
    return <div style={{padding: 20}}>Error: Maps API Key not found.</div>;
  }

  // Default center (Galgotias University)
  const center = userLocation || { lat: 28.364, lng: 77.534 }; 

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <APIProvider apiKey={MAPS_API_KEY}>
        <Map
          defaultCenter={center}
          defaultZoom={19} 
          mapId="DEMO_MAP_ID" 
          fullscreenControl={false}
          streetViewControl={false}
          disableDefaultUI={true}
        >
          {/* 🔵 User's Live Location */}
          {userLocation && (
             <AdvancedMarker position={userLocation}>
                <div style={{
                  width: '16px', height: '16px', 
                  backgroundColor: '#4285F4', borderRadius: '50%', 
                  border: '3px solid white', boxShadow: '0 0 10px rgba(66,133,244,0.5)'
                }} />
             </AdvancedMarker>
          )}

          {/* 📍 The Drops (Red Pins) */}
          {drops.map((drop) => (
            <AdvancedMarker 
              key={drop.id} 
              position={{ lat: drop.latitude, lng: drop.longitude }}
              onClick={() => onEnterAR(drop)} 
            >
              <Pin background={'#EA4335'} glyphColor={'#FFF'} borderColor={'#B31412'} />
            </AdvancedMarker>
          ))}
        </Map>
        
        {/* ➕ "Drop" Button */}
        <div style={{
            position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
            zIndex: 1000, width: 'max-content'
        }}>
          <Button 
            variant="contained" 
            color="secondary"
            size="large"
            onClick={onDropObject}
            style={{ borderRadius: '50px', padding: '15px 30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
          >
            📍 Drop Object Here
          </Button>
        </div>
      </APIProvider>
    </div>
  );
};

export default MapRadar;