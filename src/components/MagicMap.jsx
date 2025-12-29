import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

// 🎨 Fix for missing Leaflet marker icons in React
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix the default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: iconMarker,
  shadowUrl: iconShadow,
});

// 🧙‍♂️ Custom Icons
const magicIcon = new L.DivIcon({
  className: 'custom-icon',
  html: '<div style="font-size: 24px; filter: drop-shadow(0 0 5px cyan);">✨</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const userIcon = new L.DivIcon({
  className: 'user-pulse',
  html: '<div style="width: 16px; height: 16px; background: #FFD700; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px #FFD700;"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

// 🛸 Teleport Handler: Moves the camera when "Warp" is clicked on Home Page
const TeleportHandler = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 18, { duration: 2 }); // Smooth fly animation
    }
  }, [center, map]);
  return null;
};

// 📍 GPS Handler: Keeps the map centered on YOU (only if not warping)
const UserTrackingHandler = ({ userLocation, active }) => {
  const map = useMap();
  useEffect(() => {
    if (active && userLocation) {
      map.setView([userLocation.lat, userLocation.lng]);
    }
  }, [userLocation, active, map]);
  return null;
};

const MagicMap = ({ drops, userLocation, onMarkerClick, forcedCenter }) => {
  // Default: Galgotias University
  const defaultCenter = [28.364, 77.534]; 
  const initialCenter = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter;

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#0a0e17' }}>
      <MapContainer 
        center={initialCenter} 
        zoom={18} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false} // Clean look
      >
        {/* 🌑 DARK MODE TILES (Free CartoDB) */}
        <TileLayer
          attribution='&copy; OpenStreetMap & CartoDB'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* 🎮 Handlers for Movement */}
        <TeleportHandler center={forcedCenter ? [forcedCenter.lat, forcedCenter.lng] : null} />
        <UserTrackingHandler userLocation={userLocation} active={!forcedCenter} />

        {/* 🧙‍♂️ User Location */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />
        )}

        {/* ✨ Hidden Artifacts */}
        {drops.map((drop) => (
          <Marker 
            key={drop.id} 
            position={[drop.latitude, drop.longitude]} 
            icon={magicIcon}
            eventHandlers={{
              click: () => onMarkerClick(drop),
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MagicMap;