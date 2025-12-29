import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Grid, Modal, Fade, Backdrop } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import VisibilityIcon from '@mui/icons-material/Visibility';

// 🏛️ Dummy Data: The "Zones" of your Campus Universe
const CAMPUS_ZONES = [
  {
    id: 1,
    name: "The Innovation Core",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    secrets: 5,
    found: 2,
    students: 24,
    coords: { lat: 28.364, lng: 77.534 },
    description: "The heart of technology. Rumor has it a Golden Glitch floats near the server room."
  },
  {
    id: 2,
    name: "Library of Whispers",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    secrets: 3,
    found: 0,
    students: 8,
    coords: { lat: 28.363, lng: 77.533 },
    description: "Silence is required, but magic is loud here. Find the floating book."
  },
  {
    id: 3,
    name: "Victory Arena",
    image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80",
    secrets: 10,
    found: 1,
    students: 45,
    coords: { lat: 28.365, lng: 77.535 },
    description: "Where champions are made. Look for the hidden trophy AR marker."
  }
];

const HomePage = ({ onTeleport }) => {
  const [selectedZone, setSelectedZone] = useState(null);

  return (
    <div style={{ padding: '20px', paddingBottom: '80px', minHeight: '100vh', overflowY: 'auto' }}>
      
      {/* 🔮 Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontFamily: 'Cinzel', color: '#FFD700', textShadow: '0 0 15px rgba(255, 215, 0, 0.5)' }}>
          Campus Universe
        </Typography>
        <Typography variant="body2" sx={{ color: '#00e5ff', letterSpacing: '2px', mt: 1 }}>
          SELECT A ZONE TO EXPLORE
        </Typography>
      </Box>

      {/* 🌍 Zone Grid */}
      <Grid container spacing={3}>
        {CAMPUS_ZONES.map((zone) => (
          <Grid item xs={12} key={zone.id}>
            <Card 
              sx={{ 
                position: 'relative', overflow: 'visible',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.02)' }
              }}
              onClick={() => setSelectedZone(zone)}
            >
              {/* Zone Image */}
              <CardMedia component="img" height="160" image={zone.image} alt={zone.name} sx={{ borderRadius: '16px 16px 0 0' }} />
              
              {/* Glass Content */}
              <CardContent>
                <Typography variant="h6" sx={{ fontFamily: 'Cinzel' }}>{zone.name}</Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', color: '#aaa' }}>
                    <PeopleIcon fontSize="small" sx={{ color: '#00e5ff' }} />
                    <Typography variant="caption">{zone.students} Online</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', color: '#aaa' }}>
                    <VisibilityIcon fontSize="small" sx={{ color: '#FFD700' }} />
                    <Typography variant="caption">{zone.found}/{zone.secrets} Secrets</Typography>
                  </Box>
                </Box>
              </CardContent>

              {/* "Live" Pulse Indicator */}
              <div style={{
                position: 'absolute', top: 15, right: 15,
                width: 12, height: 12, borderRadius: '50%',
                backgroundColor: '#00ff00', boxShadow: '0 0 10px #00ff00',
                animation: 'pulse-gold 1.5s infinite'
              }} />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 📦 3D PREVIEW MODAL (The "Metaverse" View) */}
      <Modal
        open={!!selectedZone}
        onClose={() => setSelectedZone(null)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={!!selectedZone}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '90%', maxWidth: 400, bgcolor: 'background.paper',
            borderRadius: '20px', boxShadow: 24, p: 0, overflow: 'hidden', border: '1px solid #FFD700'
          }}>
            {selectedZone && (
              <>
                {/* 3D Model Viewer (Hologram Style) */}
                <div style={{ height: '300px', background: 'radial-gradient(circle, #2a2a2a 0%, #000 100%)' }}>
                  <model-viewer
                    src="/assets/book_model.glb" // 🛠️ In future, use zone-specific models!
                    auto-rotate
                    camera-controls
                    shadow-intensity="2"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>

                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ color: '#FFD700', fontFamily: 'Cinzel' }}>
                    {selectedZone.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, mb: 3, color: '#ddd' }}>
                    {selectedZone.description}
                  </Typography>

                  <Button 
                    variant="contained" fullWidth size="large"
                    startIcon={<LocationOnIcon />}
                    onClick={() => {
                      onTeleport(selectedZone.coords);
                      setSelectedZone(null);
                    }}
                    sx={{
                      background: 'linear-gradient(45deg, #00e5ff 30%, #2979ff 90%)',
                      color: 'white', fontWeight: 'bold'
                    }}
                  >
                    WARP TO ZONE
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Fade>
      </Modal>

    </div>
  );
};

export default HomePage;