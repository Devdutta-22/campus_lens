import React from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// 🌑 "Marauder Mode" Map Style
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }, // Hide business names
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

const MagicMap = ({ drops, userLocation, onMarkerClick }) => {
  const center = userLocation || { lat: 28.364, lng: 77.534 }; 

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <APIProvider apiKey={MAPS_API_KEY}>
        <Map
          defaultCenter={center}
          defaultZoom={18}
          mapId="DEMO_MAP_ID"
          options={{ 
            styles: darkMapStyle, 
            disableDefaultUI: true, 
            clickableIcons: false 
          }}
        >
          {/* 🧙‍♂️ YOU (The Wizard) */}
          {userLocation && (
             <AdvancedMarker position={userLocation}>
                <div style={{
                  width: '20px', height: '20px', 
                  backgroundColor: '#FFD700', borderRadius: '50%', 
                  border: '3px solid #fff', boxShadow: '0 0 20px #FFD700'
                }} className="magic-pulse" />
             </AdvancedMarker>
          )}

          {/* ✨ HIDDEN OBJECTS (Wisps of Magic) */}
          {drops.map((drop) => (
            <AdvancedMarker 
              key={drop.id} 
              position={{ lat: drop.latitude, lng: drop.longitude }}
              onClick={() => onMarkerClick(drop)}
            >
              <div style={{fontSize: '24px', filter: 'drop-shadow(0 0 10px cyan)'}}>✨</div>
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
};

export default MagicMap;