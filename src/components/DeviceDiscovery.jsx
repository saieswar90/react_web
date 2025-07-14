import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  CircularProgress, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Chip, 
  Avatar, 
  TextField, 
  Stack, 
  Fade,
  Paper,
  IconButton,
  useTheme
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import DevicesIcon from '@mui/icons-material/Devices';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SpeakerIcon from '@mui/icons-material/Speaker';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';

// Animated background gradient
const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Floating animation
const floatingAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

// Pulse animation
const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(144, 202, 249, 0.4);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 20px rgba(144, 202, 249, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(144, 202, 249, 0);
  }
`;

const WelcomeContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '800px',
  maxHeight: '90vh',
  overflow: 'auto',
  padding: theme.spacing(4),
  borderRadius: '32px',
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(-45deg, #1a1a1a, #2d2d2d, #1a1a1a, #2d2d2d)'
    : 'linear-gradient(-45deg, #ffffff, #f0f9ff, #ffffff, #f0f9ff)',
  backgroundSize: '400% 400%',
  animation: `${gradientAnimation} 15s ease infinite`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  boxShadow: theme.shadows[24],
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '32px',
    background: 'radial-gradient(circle at 50% 50%, rgba(144, 202, 249, 0.1) 0%, rgba(144, 202, 249, 0) 70%)',
    pointerEvents: 'none',
  },
}));

const WelcomeHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -20,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60%',
    height: '2px',
    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
  },
}));

const ActionCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  borderRadius: '24px',
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(144, 202, 249, 0.1) 0%, rgba(144, 202, 249, 0) 70%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
    '&::before': {
      opacity: 1,
    },
  },
}));

const DeviceCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(144, 202, 249, 0.1) 0%, rgba(144, 202, 249, 0) 70%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
    '&::before': {
      opacity: 1,
    },
  },
}));

const FloatingIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(144, 202, 249, 0.1)',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: '40px',
    color: theme.palette.primary.main,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  padding: theme.spacing(1.5, 3),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

// Add new styled component for the continue button
const ContinueButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(1.5, 4),
  borderRadius: '12px',
  textTransform: 'none',
  fontSize: '1.1rem',
  fontWeight: 600,
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.common.white,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
  },
}));

// Utility to deduplicate devices by name and type
function deduplicateDevices(devices) {
  const seen = new Set();
  return devices.filter(device => {
    const key = device.name + '|' + device.type;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const DeviceDiscovery = ({ onDiscoveryComplete, roomsData, setRoomsData }) => {
  const theme = useTheme();
  const [isScanning, setIsScanning] = useState(false);
  const [existingDevices, setExistingDevices] = useState([]);
  const [newDevices, setNewDevices] = useState([]);
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [addRoomMode, setAddRoomMode] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  useEffect(() => {
    const fetchExistingDevices = async () => {
      setExistingDevices([
        { id: 1, name: 'Smart Light 1', type: 'Light', status: 'connected', room: 'Living Room' },
        { id: 2, name: 'Smart Thermostat', type: 'Climate', status: 'connected', room: 'Bedroom' },
      ]);
    };
    fetchExistingDevices();
  }, []);

  // Deduplicate all rooms' devices on mount and after assignment
  useEffect(() => {
    setRoomsData(prevRooms => {
      const updated = { ...prevRooms };
      Object.keys(updated).forEach(room => {
        if (updated[room]?.devices) {
          updated[room].devices = deduplicateDevices(updated[room].devices);
        }
      });
      return updated;
    });
    // eslint-disable-next-line
  }, []);

  const handleScanDevices = async () => {
    setIsScanning(true);
    setTimeout(() => {
      setNewDevices([
        { id: 3, name: 'Smart Light 2', type: 'Light', status: 'discovered' },
        { id: 4, name: 'Smart Speaker', type: 'Audio', status: 'discovered' },
      ]);
      setIsScanning(false);
    }, 2000);
  };

  const handleContinueWithExisting = () => {
    onDiscoveryComplete(existingDevices);
  };

  const handleConnectClick = (device) => {
    setSelectedDevice(device);
    setSelectedRoom('');
    setRoomDialogOpen(true);
    setAddRoomMode(false);
    setNewRoomName('');
  };

  const handleRoomAssign = () => {
    if (!selectedRoom || !selectedDevice) return;
    setRoomsData(prevRooms => {
      const updated = { ...prevRooms };
      if (!updated[selectedRoom]) {
        updated[selectedRoom] = { devices: [] };
      }
      // Check if device already exists in the room by name and type
      const deviceExists = updated[selectedRoom].devices.some(
        device => device.name === selectedDevice.name && device.type === selectedDevice.type
      );
      if (!deviceExists) {
      updated[selectedRoom].devices = [
        ...updated[selectedRoom].devices,
        { ...selectedDevice, status: true, room: selectedRoom }
      ];
      }
      // Deduplicate after assignment
      updated[selectedRoom].devices = deduplicateDevices(updated[selectedRoom].devices);
      return updated;
    });
    // Only add to existing devices if it's not already there (by name and type)
    const deviceExists = existingDevices.some(device => device.name === selectedDevice.name && device.type === selectedDevice.type);
    if (!deviceExists) {
    setExistingDevices([...existingDevices, { ...selectedDevice, status: true, room: selectedRoom }]);
    }
    setNewDevices(newDevices.filter(d => d.id !== selectedDevice.id));
    setRoomDialogOpen(false);
    setSelectedDevice(null);
    setSelectedRoom('');
  };

  const handleAddRoom = () => {
    if (!newRoomName.trim()) return;
    setRoomsData(prevRooms => ({
      ...prevRooms,
      [newRoomName]: { devices: [] }
    }));
    setSelectedRoom(newRoomName);
    setAddRoomMode(false);
    setNewRoomName('');
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
      }}
    >
      <WelcomeContainer>
        <WelcomeHeader>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h3" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome to Smart Home
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ mb: 4 }}
            >
              Let's set up your smart devices
      </Typography>
          </motion.div>
        </WelcomeHeader>
      
        <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ActionCard onClick={handleScanDevices}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <FloatingIcon>
                    <SearchIcon />
                  </FloatingIcon>
              <Typography variant="h6" gutterBottom>
                Scan for New Devices
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Discover and connect new smart devices in your network
              </Typography>
              {isScanning && (
                <Box sx={{ mt: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </CardContent>
              </ActionCard>
            </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ActionCard onClick={handleContinueWithExisting}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <FloatingIcon>
                    <DevicesIcon />
                  </FloatingIcon>
              <Typography variant="h6" gutterBottom>
                Continue with Existing Devices
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your currently connected smart devices
              </Typography>
            </CardContent>
              </ActionCard>
            </motion.div>
        </Grid>
      </Grid>

        <AnimatePresence>
      {newDevices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
        <Box sx={{ mt: 4 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <DevicesIcon color="primary" />
            New Devices Found
          </Typography>
          <Grid container spacing={2}>
            {newDevices.map((device) => (
              <Grid item xs={12} sm={6} md={4} key={device.id}>
                <Fade in timeout={500}>
                        <DeviceCard sx={{ p: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: device.type === 'Light' ? 'warning.main' : 'primary.main',
                              }}
                            >
                              {device.type === 'Light' ? <LightbulbIcon /> : <SpeakerIcon />}
                            </Avatar>
                      <Typography variant="h6">{device.name}</Typography>
                    </Stack>
                    <Typography color="text.secondary" sx={{ mb: 1 }}>{device.type}</Typography>
                          <Chip 
                            label="Discovered" 
                            color="info" 
                            size="small" 
                            sx={{ mb: 2 }} 
                          />
                          <StyledButton
                      variant="contained"
                      size="small"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleConnectClick(device)}
                            fullWidth
                    >
                      Connect
                          </StyledButton>
                        </DeviceCard>
                </Fade>
              </Grid>
            ))}
          </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <ContinueButton
                    variant="contained"
                    onClick={handleContinueWithExisting}
                    startIcon={<CheckCircleIcon />}
                  >
                    Continue with Discovered Devices
                  </ContinueButton>
                </Box>
        </Box>
            </motion.div>
          )}
        </AnimatePresence>

        <Dialog 
          open={roomDialogOpen} 
          onClose={() => setRoomDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: '24px',
              background: theme => theme.palette.mode === 'dark'
                ? 'rgba(26, 26, 26, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.1)'}`,
            }
          }}
        >
        <DialogTitle>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Assign Device to Room
            </Typography>
            <IconButton
              onClick={() => setRoomDialogOpen(false)}
              sx={{ 
                position: 'absolute', 
                right: 8, 
                top: 8,
                '&:hover': {
                  transform: 'rotate(90deg)',
                  transition: 'transform 0.3s ease',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent>
            <Box sx={{ mt: 2 }}>
              {addRoomMode ? (
              <TextField
                  fullWidth
                label="New Room Name"
                value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  sx={{ mb: 2 }}
                  variant="outlined"
                  InputProps={{
                    sx: { borderRadius: '12px' },
                  }}
                />
              ) : (
                <Stack spacing={1}>
                  {Object.keys(roomsData).map((room) => (
                    <StyledButton
                      key={room}
                      variant={selectedRoom === room ? 'contained' : 'outlined'}
                      onClick={() => setSelectedRoom(room)}
                      fullWidth
                    >
                      {room}
                    </StyledButton>
                  ))}
            </Stack>
          )}
            </Box>
        </DialogContent>
        <DialogActions>
            <StyledButton 
              onClick={() => setAddRoomMode(!addRoomMode)}
              variant="outlined"
            >
              {addRoomMode ? 'Select Existing Room' : 'Add New Room'}
            </StyledButton>
            <StyledButton
              variant="contained"
              onClick={addRoomMode ? handleAddRoom : handleRoomAssign}
              disabled={addRoomMode ? !newRoomName.trim() : !selectedRoom}
            >
              {addRoomMode ? 'Add Room' : 'Assign Device'}
            </StyledButton>
        </DialogActions>
      </Dialog>
      </WelcomeContainer>
    </Box>
  );
};

export default DeviceDiscovery; 