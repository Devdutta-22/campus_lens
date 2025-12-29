import React from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

// 🎨 Fix for missing marker icons in React Leaflet
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: iconMarker,
  shadowUrl: iconShadow,
});

// 🧙‍♂️ Custom "Magical" Icons
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

// 📍 Helper to auto-center the map when you walk
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

const MagicMap = ({ drops, userLocation, onMarkerClick }) => {
  // Default: Galgotias University (Fallback if no GPS)
  const defaultCenter = [28.364, 77.534]; 
  const center = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter;

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#0a0e17' }}>
      <MapContainer 
        center={center} 
        zoom={18} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false} // Clean look (no + / - buttons)
      >
        {/* 🌑 DARK MODE TILES (Free & No Key Required) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* 🔵 Auto-follow User */}
        {userLocation && <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />}

        {/* 🧙‍♂️ User Dot */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />
        )}

        {/* ✨ Hidden Messages */}
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