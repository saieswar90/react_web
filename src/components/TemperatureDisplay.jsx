import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, Switch, styled, IconButton, Slider, Tooltip } from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  WaterDrop as WaterDropIcon,
  AcUnit as AcUnitIcon,
  WbSunny as WbSunnyIcon,
  Thermostat as ThermostatIcon,
} from '@mui/icons-material';

const TemperatureDisplay = ({ roomsData, selectedRoom, setRoomsData }) => {
  const [selectedRoomName, setSelectedRoomName] = useState(selectedRoom || 'Living Room');
  const [temperature, setTemperature] = useState(24);
  const [humidity, setHumidity] = useState(65);
  const [controlEnabled, setControlEnabled] = useState(true);

  // Update temperature and humidity based on selected room
  useEffect(() => {
    if (roomsData[selectedRoomName]) {
      const roomTemp = roomsData[selectedRoomName].temperature || 24;
      const roomHumidity = roomsData[selectedRoomName].humidity || 65;
      setTemperature(roomTemp);
      setHumidity(roomHumidity);
    }
  }, [selectedRoomName, roomsData]);

  // Handle temperature change
  const handleTemperatureChange = (newValue) => {
    if (controlEnabled) {
      setTemperature(newValue);
        // Update room data
        setRoomsData(prev => ({
          ...prev,
          [selectedRoomName]: {
            ...prev[selectedRoomName],
          temperature: newValue
          }
        }));
      }
  };

  // Get temperature color based on value
  const getTemperatureColor = (temp) => {
    if (temp < 20) return '#2196F3'; // Cold - Blue
    if (temp < 25) return '#4CAF50'; // Comfortable - Green
    if (temp < 28) return '#FFC107'; // Warm - Yellow
    return '#F44336'; // Hot - Red
  };

  // Get temperature icon based on value
  const getTemperatureIcon = (temp) => {
    if (temp < 20) return <AcUnitIcon />;
    if (temp < 25) return <ThermostatIcon />;
    return <WbSunnyIcon />;
  };

  const StyledContainer = styled(Box)(({ theme }) => ({
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(145deg, rgba(26, 26, 26, 0.9), rgba(42, 42, 42, 0.9))'
      : 'linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(240, 240, 240, 0.9))',
    borderRadius: 24,
    padding: theme.spacing(3),
    boxShadow: theme.shadows[4],
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.1)'}`,
  }));

  const TemperatureGauge = styled(Box)(({ theme, temp }) => ({
    width: 300,
    height: 300,
    borderRadius: '50%',
    background: `conic-gradient(
      ${getTemperatureColor(temp)} 0%,
      ${getTemperatureColor(temp)} ${(temp - 16) * 7.14}%,
      rgba(255, 255, 255, 0.1) ${(temp - 16) * 7.14}%,
      rgba(255, 255, 255, 0.1) 100%
    )`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    boxShadow: `0 0 30px ${getTemperatureColor(temp)}40`,
    '&::before': {
      content: '""',
      position: 'absolute',
      width: '85%',
      height: '85%',
      borderRadius: '50%',
      background: theme.palette.background.paper,
      boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.1)',
    },
  }));

  const StyledSlider = styled(Slider)(({ theme }) => ({
    color: getTemperatureColor(temperature),
    height: 8,
    '& .MuiSlider-track': {
      border: 'none',
      background: `linear-gradient(90deg, ${getTemperatureColor(16)} 0%, ${getTemperatureColor(30)} 100%)`,
    },
    '& .MuiSlider-thumb': {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: `2px solid ${getTemperatureColor(temperature)}`,
      boxShadow: `0 0 10px ${getTemperatureColor(temperature)}40`,
    },
    '& .MuiSlider-rail': {
      opacity: 0.3,
      background: `linear-gradient(90deg, ${getTemperatureColor(16)} 0%, ${getTemperatureColor(30)} 100%)`,
    },
  }));

  return (
    <StyledContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Room Temperature
          </Typography>
          <Select
            value={selectedRoomName}
            onChange={(e) => setSelectedRoomName(e.target.value)}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'background.paper',
              },
            }}
          >
            {Object.keys(roomsData).map((room) => (
              <MenuItem key={room} value={room}>
                {room}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WaterDropIcon color="primary" />
            <Typography variant="body2" color="text.secondary">
              {humidity}%
          </Typography>
          </Box>
          <Tooltip title={controlEnabled ? "Disable Controls" : "Enable Controls"}>
          <Switch
            checked={controlEnabled}
            onChange={(e) => setControlEnabled(e.target.checked)}
            sx={{
              '& .MuiSwitch-switchBase': {
                color: controlEnabled ? 'success.main' : 'error.main',
              },
            }}
          />
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
        <TemperatureGauge temp={temperature}>
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <Typography
              variant="h1" 
              sx={{
                fontWeight: 'bold',
                color: getTemperatureColor(temperature),
                fontSize: '4rem',
                mb: 1
              }}
            >
              {temperature}°C
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              {getTemperatureIcon(temperature)}
              <Typography variant="h6" color="text.secondary">
                {temperature < 20 ? 'Cold' : temperature < 25 ? 'Comfortable' : temperature < 28 ? 'Warm' : 'Hot'}
              </Typography>
            </Box>
          </Box>
        </TemperatureGauge>
      </Box>

      <Box sx={{ px: 2 }}>
        <StyledSlider
          value={temperature}
          onChange={(_, newValue) => handleTemperatureChange(newValue)}
          min={16}
          max={30}
          step={0.5}
          disabled={!controlEnabled}
          marks={[
            { value: 16, label: '16°C' },
            { value: 20, label: '20°C' },
            { value: 25, label: '25°C' },
            { value: 30, label: '30°C' },
          ]}
        />
        </Box>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
        <IconButton
          onClick={() => handleTemperatureChange(Math.max(16, temperature - 1))}
          disabled={!controlEnabled || temperature <= 16}
          sx={{
            color: getTemperatureColor(temperature),
              '&:hover': {
              backgroundColor: `${getTemperatureColor(temperature)}20`,
              },
            }}
          >
          <ExpandLessIcon />
          </IconButton>
          <IconButton
          onClick={() => handleTemperatureChange(Math.min(30, temperature + 1))}
          disabled={!controlEnabled || temperature >= 30}
            sx={{
            color: getTemperatureColor(temperature),
              '&:hover': {
              backgroundColor: `${getTemperatureColor(temperature)}20`,
              },
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
    </StyledContainer>
  );
};

export default TemperatureDisplay;
