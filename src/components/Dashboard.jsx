import React, { useState, useEffect, useRef } from 'react';
import { Box, Grid, Typography, Paper, Avatar, Collapse, IconButton, Select, Divider, Switch, Slide, Fade, Stack, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { keyframes } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import TemperatureDisplay from './TemperatureDisplay';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import ButtonGroup from '@mui/material/ButtonGroup';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TvIcon from '@mui/icons-material/Tv';
import AirIcon from '@mui/icons-material/AcUnit';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import CloudIcon from '@mui/icons-material/Cloud';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import WindIcon from '@mui/icons-material/WindPower';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { motion } from 'framer-motion';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TodayIcon from '@mui/icons-material/Today';
import HistoryIcon from '@mui/icons-material/History';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getFirestore, doc, collection, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { db } from '../firebase/config';

// Backend URLs
const backendUrl = "https://app-web-backend-5dd0.onrender.com";
const wsUrl = "wss://app-web-backend-5dd0.onrender.com";

// Recharts components
const RechartsLineChart = LineChart;
const RechartsLine = Line;
const RechartsXAxis = XAxis;
const RechartsYAxis = YAxis;
const RechartsCartesianGrid = CartesianGrid;
const RechartsTooltip = Tooltip;

// Mock temperature data
const mockTemperatureData = {
  current: 24.5,
  condition: 'sunny',
  humidity: 65,
  feelsLike: 26.3,
  lastUpdated: new Date().toLocaleTimeString()
};

// Temperature block component
const TemperatureBlock = () => {
  const [temperature, setTemperature] = useState(mockTemperatureData);
  const [gradientColor, setGradientColor] = useState('');

  // Update temperature data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature((prev) => ({
        ...prev,
        lastUpdated: new Date().toLocaleTimeString()
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Calculate gauge color based on temperature
  const getGaugeColor = (temp) => {
    if (temp < 15) return '#0074D9'; // Blue for cold
    if (temp < 25) return '#39B54A'; // Green for moderate
    return '#FF4136'; // Red for hot
  };

  // Get weather icon based on temperature
  const getWeatherIcon = (temp) => {
    if (temp < 15) return <WbSunnyIcon sx={{ fontSize: 24 }} />;
    if (temp < 25) return <CloudIcon sx={{ fontSize: 24 }} />;
    return <ThunderstormIcon sx={{ fontSize: 24 }} />;
  };

  // Get background gradient based on temperature
  const getBackgroundGradient = (temp) => {
    const coldColor = '#0074D9';
    const warmColor = '#FF4136';
    const gradient = `linear-gradient(145deg, ${coldColor} 0%, ${warmColor} 100%)`;
    return gradient;
  };

  // Update gradient when temperature changes
  useEffect(() => {
    const gradient = getBackgroundGradient(temperature.current);
    setGradientColor(gradient);
  }, [temperature.current]);

  const gaugeColor = getGaugeColor(temperature.current);

  return (
    <Paper
      elevation={3}
      sx={(theme) => ({
        p: 3,
        mb: 3,
        borderRadius: 2,
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[3]
      })}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="subtitle1"
          sx={(theme) => ({
            color: theme.palette.text.primary,
            fontWeight: 500,
            opacity: 0.9,
            mr: 1
          })}
        >
          Average Home Temperature
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: 200,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          {/* Animated weather icons */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity: 0.3
            }}
          >
            {getWeatherIcon(temperature.current)}
            {getWeatherIcon(temperature.current)}
          </Box>
          
          <svg width="100%" height="100%">
            {/* Base circle */}
            <circle
              cx="50%"
              cy="50%"
              r="40%"
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="12"
              strokeDasharray="10 10"
            />
            {/* Temperature arc */}
            <circle
              cx="50%"
              cy="50%"
              r="40%"
              fill="none"
              stroke={gaugeColor}
              strokeWidth="12"
              strokeDasharray={`${(temperature.current / 40) * 100} 100`}
              transform="rotate(-90) translate(-20)"
              style={{
                transition: 'stroke 0.5s ease-in-out'
              }}
            />
          </svg>
          
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Typography
              variant="h3"
              sx={(theme) => ({
                fontWeight: 'bold',
                color: theme.palette.text.primary,
                textShadow: `0 2px 8px ${theme.palette.background.default}`,
                transition: 'color 0.3s ease'
              })}
            >
              {temperature.current}°C
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              <Typography variant="body1" sx={(theme) => ({
                color: theme.palette.text.secondary
              })}>
                {temperature.humidity}%
              </Typography>
              {getWeatherIcon(temperature.current)}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          color: 'rgba(255, 255, 255, 0.7)',
          mt: 2
        }}
      >
        <Typography variant="body2" sx={(theme) => ({
          color: theme.palette.text.secondary
        })}>
          Feels like: {temperature.feelsLike}°C
        </Typography>
        <Typography variant="body2" sx={(theme) => ({
          color: theme.palette.text.secondary
        })}>
          Last updated: {temperature.lastUpdated}
        </Typography>
      </Box>
    </Paper>
  );
};

// Function to calculate daily total energy consumption
const calculateDailyTotal = () => {
  const yesterday = new Date(CURRENT_TIME);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  // Generate hourly data for yesterday
  const hourlyData = getEnergyDataHourly();
  
  // Calculate total consumption and convert to units (1000W = 1 unit)
  const totalWatts = hourlyData.reduce((sum, hour) => sum + hour.consumption, 0);
  const totalUnits = totalWatts / 1000;
  
  return {
    date: yesterday.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    total: totalUnits
  };
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    color: theme.palette.error.main,
    transition: 'color 0.3s ease',
    '&.Mui-checked': {
      color: theme.palette.success.main,
    },
  },
  '& .MuiSwitch-track': {
    backgroundColor: theme.palette.error.main,
    opacity: 0.3,
    transition: 'background-color 0.3s ease',
    '&.Mui-checked': {
      backgroundColor: theme.palette.success.main,
      opacity: 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
}));

const RoomSection = styled(Box)(({ theme }) => ({
  borderRadius: 16,
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const RoomHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.02)',
  },
}));

const RoomSummary = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const DeviceCard = styled(Box)(({ theme, status }) => ({
  borderRadius: 12,
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  backdropFilter: 'blur(5px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
  '& .device-icon': {
    transition: 'transform 0.3s ease',
  },
  '&:hover .device-icon': {
    transform: 'scale(1.1)',
  },
}));

const DeviceStatusBadge = styled(Box)(({ theme, status }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: status ? theme.palette.success.main : theme.palette.error.main,
  boxShadow: status ? `0 0 8px ${theme.palette.success.main}` : `0 0 8px ${theme.palette.error.main}`,
  transition: 'all 0.2s ease',
}));

const DeviceIcon = styled(Box)({
  width: 40,
  height: 40,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
});

const QuickAccessSection = styled(Box)(({ theme }) => ({
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(2),
  transition: 'box-shadow 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  },
}));

const QuickAccessHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const QuickAccessDevice = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const QuickAccessSelect = styled(Select)(({ theme }) => ({
  minWidth: 120,
  '& .MuiSelect-select': {
    padding: '8px 12px',
    fontSize: '0.875rem',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ccc',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#4CAF50',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#4CAF50',
  },
}));

const WeatherSection = styled(Box)(({ theme }) => ({
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(2),
  transition: 'box-shadow 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  },
}));

const WeatherHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const WeatherContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: theme.spacing(2),
}));

const WeatherCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  backdropFilter: 'blur(5px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const MembersSection = styled(Box)({
  borderRadius: 12,
  backgroundColor: 'background.paper',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginBottom: 2,
  transition: 'box-shadow 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  },
});

const MemberCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  backdropFilter: 'blur(5px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const MemberAvatar = styled(Avatar)({
  width: 40,
  height: 40,
  fontSize: '1.25rem',
  backgroundColor: 'primary.main',
  color: 'primary.contrastText',
});

const RoomControl = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: 8,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const DeviceControl = styled(Box)(({ theme, status }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: status === 'online' ? theme.palette.success.main : theme.palette.error.main,
  borderRadius: 8,
}));

const ThermostatControl = styled(Box)(({ theme }) => ({
  width: 200,
  height: 200,
  borderRadius: '50%',
  border: `4px solid ${theme.palette.primary.main}`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 auto',
}));

// Dynamic energy data generation based on current date/time
const CURRENT_TIME = new Date();

const getEnergyDataHourly = () => {
  const hours = [];
  const now = new Date();
  
  // Generate data for the past 24 hours
  for (let i = 23; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(now.getHours() - i);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    
    // Base consumption (0.1-0.3 kW)
    let consumption = 0.1 + Math.random() * 0.2;
    
    // Add daily pattern (higher during morning and evening)
    const hour = d.getHours();
    if ((hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 22)) {
      // Peak hours
      consumption += 0.5 + Math.random() * 0.5; // 0.5-1.0 kW additional during peak
    } else if (hour >= 11 && hour <= 16) {
      // Daytime
      consumption += 0.2 + Math.random() * 0.3; // 0.2-0.5 kW additional
    } else {
      // Night time
      consumption += Math.random() * 0.2; // 0-0.2 kW additional
    }
    
    // Add some randomness but keep within 0-2 kW range
    consumption = Math.min(Math.max(consumption, 0), 2);
    
    // Format label to show time and date if it's not today
    let label;
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
      label = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      label = d.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }
    
    hours.push({ 
      timestamp: d,
      label: label,
      consumption: parseFloat(consumption.toFixed(2))
    });
  }
  return hours;
};

function getEnergyDataDaily() {
  // Show last 7 days with full dates and weekday/weekend variations
  const days = [];
  const weekdayBase = 22; // Base consumption for weekdays (kW)
  const weekendBase = 32; // Base consumption for weekends (kW)
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(CURRENT_TIME);
    d.setDate(CURRENT_TIME.getDate() - i);
    
    // Base consumption based on day type
    let consumption = d.getDay() === 0 || d.getDay() === 6 ? 
      weekendBase : weekdayBase;
    
    // Add seasonal variation (more consumption in winter)
    const month = d.getMonth();
    if (month >= 11 || month <= 2) { // Winter months
      consumption *= 1.15; // 15% more in winter
    } else if (month >= 6 && month <= 8) { // Summer months
      consumption *= 1.05; // 5% more in summer
    }
    
    // Add some variation but keep it smooth and within range
    if (days.length > 0) {
      const lastConsumption = days[days.length - 1].consumption;
      // Ensure the value stays within 15-40 kW range
      consumption = Math.min(
        Math.max(
          lastConsumption * (0.95 + Math.random() * 0.1), // ±5% variation from previous day
          15 // Minimum 15 kW
        ),
        40 // Maximum 40 kW
      );
    } else {
      // For the first day, ensure it's within range
      consumption = Math.min(Math.max(consumption, 15), 40);
    }
    
    // Format date as "DD MMM YYYY"
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = d.toLocaleDateString('en-US', options);
    
    days.push({
      label: formattedDate,
      consumption: parseFloat(consumption.toFixed(2)) // Keep 2 decimal places for kW values
    });
  }
  return days;
}

function getEnergyDataWeekly() {
  // Show last 4 weeks (simple labels)
  const weeks = [];
  for (let i = 3; i >= 0; i--) {
    const weekLabel = `Week ${4 - i}`;
    // Generate weekly consumption in the 90-200 kW range
    const weeklyConsumption = 90 + Math.random() * 110; // 90-200 kW range
    weeks.push({
      label: weekLabel,
      consumption: parseFloat(weeklyConsumption.toFixed(2))
    });
  }
  return weeks;
}

function getEnergyDataMonthly() {
  // Show last 6 months up to current
  const months = [];
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let currMonth = CURRENT_TIME.getMonth();
  let currYear = CURRENT_TIME.getFullYear();
  for (let i = 5; i >= 0; i--) {
    let m = currMonth - i;
    let y = currYear;
    if (m < 0) {
      m += 12;
      y--;
    }
    // Generate monthly consumption in the 800-1000 kW range
    const monthlyConsumption = 800 + Math.random() * 200; // 800-1000 kW range
    months.push({
      label: `${monthNames[m]}`,
      consumption: parseFloat(monthlyConsumption.toFixed(2))
    });
  }
  return months;
}

function getEnergyDataYearly() {
  // Show last 5 years up to current
  const years = [];
  const currentYear = CURRENT_TIME.getFullYear();
  for (let i = 4; i >= 0; i--) {
    const year = currentYear - i;
    // Generate yearly consumption in the 9000-15000 kW range
    const yearlyConsumption = 9000 + Math.random() * 6000; // 9000-15000 kW range
    years.push({
      label: year.toString(),
      consumption: parseFloat(yearlyConsumption.toFixed(2))
    });
  }
  return years;
}

// Room data is now passed as props from App.jsx

const members = [
  { name: 'Alex', role: 'Admin', avatar: 'A' },
  { name: 'Sarah', role: 'Full Access', avatar: 'S' },
];

const getDeviceIcon = (deviceName) => {
  if (deviceName.toLowerCase().includes('tv')) return <TvIcon />;
  if (deviceName.toLowerCase().includes('ac') || deviceName.toLowerCase().includes('air')) return <AirIcon />;
  if (deviceName.toLowerCase().includes('light')) return <LightbulbIcon />;
  return <PowerSettingsNewIcon />;
};

const getWeatherIcon = (condition) => {
  switch (condition.toLowerCase()) {
    case 'sunny':
      return <WbSunnyIcon sx={{ fontSize: 40 }} />;
    case 'partly cloudy':
      return <CloudQueueIcon sx={{ fontSize: 40 }} />;
    case 'cloudy':
      return <CloudIcon sx={{ fontSize: 40 }} />;
    case 'rain':
      return <WaterDropIcon sx={{ fontSize: 40 }} />;
    case 'thunderstorm':
      return <ThunderstormIcon sx={{ fontSize: 40 }} />;
    default:
      return <CloudQueueIcon sx={{ fontSize: 40 }} />;
  }
};

// Define animations using MUI keyframes
const bellAnimation = keyframes`
  0% { transform: rotate(0); }
  15% { transform: rotate(5deg); }
  30% { transform: rotate(-5deg); }
  45% { transform: rotate(4deg); }
  60% { transform: rotate(-4deg); }
  75% { transform: rotate(2deg); }
  85% { transform: rotate(-2deg); }
  100% { transform: rotate(0); }
`;

// Inject the bell animation into the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = bellAnimation.toString();
  document.head.appendChild(style);
}

const IconToggle = styled(Box)(({ theme, status, disabled }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: disabled ? 'not-allowed' : 'pointer',
  backgroundColor: status ? theme.palette.success.main : theme.palette.error.main,
  color: theme.palette.common.white,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: status ? 'pulse 2s infinite' : 'none',
  opacity: disabled ? 0.5 : 1,
  '&:hover': {
    transform: disabled ? 'none' : 'scale(1.1)',
    boxShadow: disabled ? 'none' : `0 0 12px ${status ? theme.palette.success.main : theme.palette.error.main}`,
  },
  '&:active': {
    transform: disabled ? 'none' : 'scale(0.95)',
  },
}));

const getDeviceEmoji = (deviceName) => {
  const name = deviceName.toLowerCase();
  if (name.includes('tv')) return '📺';
  if (name.includes('ac') || name.includes('air')) return '❄️';
  if (name.includes('light')) return '💡';
  if (name.includes('fan')) return '🌀';
  if (name.includes('water') || name.includes('heater')) return '🚿';
  if (name.includes('mirror')) return '🪞';
  if (name.includes('oven')) return '🔥';
  if (name.includes('dishwasher')) return '🍽️';
  if (name.includes('refrigerator')) return '❄️';
  return '🔌';
};

// Define pulse animation using keyframes
const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.8);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
`;

// Define PulseAnimation component
const PulseAnimation = styled(Box)`
  animation: ${pulseAnimation} 2s infinite;
`;

// Update NotificationBell to use the pulse animation
const NotificationBell = styled(IconButton)(({ theme, hasNotifications }) => ({
  animation: hasNotifications ? 'bell 1s ease-in-out infinite' : 'none',
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.error.main,
    boxShadow: `0 0 8px ${theme.palette.error.main}`,
    animation: hasNotifications ? pulseAnimation : 'none',
  }
}));

// Inject the bell animation into the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes bell {
      0% { transform: rotate(0); }
      15% { transform: rotate(5deg); }
      30% { transform: rotate(-5deg); }
      45% { transform: rotate(4deg); }
      60% { transform: rotate(-4deg); }
      75% { transform: rotate(2deg); }
      85% { transform: rotate(-2deg); }
      100% { transform: rotate(0); }
    }
  `;
  document.head.appendChild(style);
}

const NotificationMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    width: 320,
    maxHeight: 400,
    backgroundColor: theme.palette.background.paper,
    backdropFilter: 'blur(8px)',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  },
}));

const NotificationItem = styled(MenuItem)(({ theme, unread }) => ({
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: unread ? theme.palette.action.hover : 'transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
  '& .notification-content': {
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
  },
  '& .notification-title': {
    fontWeight: unread ? 600 : 400,
    color: theme.palette.text.primary,
  },
  '& .notification-time': {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
  },
  '& .notification-message': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  },
}));

const DashboardBanner = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(6),
  borderRadius: 32,
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(42, 42, 42, 0.95) 100%)'
    : 'linear-gradient(135deg, rgba(240, 249, 255, 0.95) 0%, rgba(224, 242, 254, 0.95) 100%)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  overflow: 'hidden',
  marginBottom: theme.spacing(6),
  boxShadow: theme.shadows[8],
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
    opacity: 0.5,
    pointerEvents: 'none',
  },
}));

const WeatherInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: 16,
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  backdropFilter: 'blur(5px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const UserGreeting = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: 16,
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  backdropFilter: 'blur(5px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56,
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  fontSize: 24,
  fontWeight: 'bold',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.05) rotate(360deg)',
    boxShadow: theme.shadows[4],
  },
}));

const TimeDisplay = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  textAlign: 'center',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const EnergyCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 24,
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 48px rgba(0, 0, 0, 0.4)'
      : '0 12px 48px rgba(0, 0, 0, 0.2)',
  },
}));

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  '& .MuiButton-root': {
    borderRadius: 12,
    textTransform: 'capitalize',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
}));

const AnimatedTooltip = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(0, 0, 0, 0.9)'
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  padding: theme.spacing(2),
  borderRadius: 12,
  boxShadow: theme.shadows[4],
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  '& .label': {
    color: theme.palette.text.primary,
    fontWeight: 600,
    marginBottom: theme.spacing(0.5),
  },
  '& .value': {
    color: theme.palette.primary.main,
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: theme.spacing(0.5),
  },
  '& .timestamp': {
    color: theme.palette.text.secondary,
    fontSize: '0.9rem',
  },
}));

const SummaryCard = styled(Box)(({ theme }) => ({
  borderRadius: 16,
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 48px rgba(0, 0, 0, 0.4)'
      : '0 12px 48px rgba(0, 0, 0, 0.2)',
  },
}));

const SummaryHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.02)',
  },
}));

const SummaryContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
}));

// Add this after the StyledButtonGroup component
const ViewAllButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5, 3),
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
    : 'linear-gradient(45deg, #1976D2 30%, #42A5F5 90%)',
  color: '#fff',
  boxShadow: '0 3px 12px rgba(33, 150, 243, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
  },
}));

// Hardcoded house members for now
const houseMembers = ['Alex', 'Priya', 'Sam'];

// Utility functions for device and room stats
const getDeviceStats = (roomsData) => {
  let total = 0, on = 0;
  Object.values(roomsData).forEach(room => {
    if (room.devices) {
      total += room.devices.length;
      on += room.devices.filter(d => d.status).length;
    }
  });
  return { total, on };
};
const getRoomStats = (roomsData) => {
  let total = Object.keys(roomsData).length;
  let occupied = 0;
  Object.values(roomsData).forEach(room => {
    if (room.devices && room.devices.some(d => d.status)) occupied++;
  });
  return { total, occupied };
};

const Dashboard = ({ isGuest, discoveredDevices = [], roomsData, setRoomsData, username }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Firebase and WebSocket state
  const deviceId = localStorage.getItem("deviceId");
  const updateHomeId = localStorage.getItem("updateHomeId");
  const originalHomeId = localStorage.getItem("originalHomeId");
  const currentUsername = localStorage.getItem("username") || username || "User";

  const [relays, setRelays] = useState({});
  const [relayStates, setRelayStates] = useState({});
  const [allRelays, setAllRelays] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [checkedRelays, setCheckedRelays] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [roomOptionsRoom, setRoomOptionsRoom] = useState("");

  const switchRefs = useRef({});
  const userInitiatedMap = useRef({});
  const latestRelayStates = useRef({});
  const webSocketRef = useRef(null);

  // Get time-based greeting
  const getTimeGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 18) return 'Good Afternoon';
    if (hour >= 18 && hour < 22) return 'Good Evening';
    return 'Good Night';
  };

  // Get avatar initials
  const getAvatarInitials = (name) => {
    const parts = name.split(' ');
    const first = parts[0] ? parts[0][0] : '';
    const last = parts[1] ? parts[1][0] : '';
    return (first + last).toUpperCase();
  };

  const [energyView, setEnergyView] = React.useState('hourly');
  
  // Memoize energy data to prevent unnecessary recalculations
  const hourlyData = React.useMemo(() => getEnergyDataHourly(), []);
  const dailyData = React.useMemo(() => getEnergyDataDaily(), []);
  const weeklyData = React.useMemo(() => getEnergyDataWeekly(), []);
  const monthlyData = React.useMemo(() => getEnergyDataMonthly(), []);

  // Set initial energy data based on view
  const [energyData, setEnergyData] = React.useState(hourlyData);
  const dailyTotal = React.useMemo(() => calculateDailyTotal(), []);

  // Firebase and WebSocket functions
  const fetchRelayData = async () => {
    try {
      const res = await fetch(`${backendUrl}/relays/${deviceId}?originalHomeId=${originalHomeId}`);
      const relaysArray = await res.json();
      const statesRes = await fetch(`${backendUrl}/states/${deviceId}`);
      const statesMap = await statesRes.json();
      
      // Store current states globally
      Object.entries(statesMap).forEach(([relay, state]) => {
        latestRelayStates.current[relay] = state;
      });
      
      setRelayStates(statesMap);
      setAllRelays(relaysArray.map(r => r.relay));
    } catch (err) {
      console.error("Error fetching relay data:", err);
    }
  };

  const fetchRoomMap = async () => {
    const roomMap = {};
    const snapshot = await getDocs(collection(db, "web_relays", deviceId, "relays"));
    snapshot.forEach(doc => {
      roomMap[doc.id] = doc.data().relays || [];
    });
    setRelays(roomMap);
  };

  const sendCommand = async (relay, command) => {
    try {
      await fetch(`${backendUrl}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, updateHomeId, relay, command })
      });
    } catch (err) {
      console.error("Send command failed:", err);
    }
  };

  const handleSwitchChange = (relay, room, checked) => {
    const key = `${room}_${relay}`;
    if (userInitiatedMap.current[key]) {
      sendCommand(relay, checked ? "ON" : "OFF");
      userInitiatedMap.current[key] = false;
    }
  };

  const updateSwitchState = (relayName, value) => {
    latestRelayStates.current[relayName] = value; // Always track state globally

    const isOn = value === "ON";
    
    setRelayStates(prev => ({ ...prev, [relayName]: value }));

    // Update switch ref if it exists and user didn't initiate the change
    for (const room in relays) {
      const key = `${room}_${relayName}`;
      if (switchRefs.current[key] && !userInitiatedMap.current[key]) {
        switchRefs.current[key].checked = isOn;
      }
    }
  };

  const openRoomDialog = (roomName = "") => {
    setSelectedRoom(roomName);
    const currentRelays = relays[roomName] || [];
    
    // If editing an existing room, show all relays with current selections
    if (roomName && relays[roomName]) {
      const newChecked = {};
      allRelays.forEach(r => {
        newChecked[r] = currentRelays.includes(r);
      });
      setCheckedRelays(newChecked);
    } else {
      // If creating a new room, only show unassigned relays
      const assignedRelays = Object.values(relays).flat();
      const unassignedRelays = allRelays.filter(r => !assignedRelays.includes(r));
      const newChecked = {};
      unassignedRelays.forEach(r => {
        newChecked[r] = false;
      });
      setCheckedRelays(newChecked);
    }
    setOpenDialog(true);
  };

  const saveRoomRelays = async () => {
    const selected = Object.entries(checkedRelays)
      .filter(([, v]) => v)
      .map(([k]) => k);
    
    // Validate that room name is provided
    if (!selectedRoom.trim()) {
      showToast('Please enter a room name', 'error');
      return;
    }
    
    // Validate that at least one relay is selected
    if (selected.length === 0) {
      showToast('Please select at least one relay for the room', 'error');
      return;
    }
    
    const roomDoc = doc(db, "web_relays", deviceId, "relays", selectedRoom);
    await setDoc(roomDoc, { relays: selected });
    setRelays(prev => ({ ...prev, [selectedRoom]: selected }));
    setOpenDialog(false);
    showToast(`Room "${selectedRoom}" ${relays[selectedRoom] ? 'updated' : 'created'} successfully`, 'success');
  };

  const deleteRoom = async () => {
    const docRef = doc(db, "web_relays", deviceId, "relays", roomOptionsRoom);
    await deleteDoc(docRef);
    const updated = { ...relays };
    delete updated[roomOptionsRoom];
    setRelays(updated);
    setAnchorEl(null);
  };

  // Update energy data when view changes
  React.useEffect(() => {
    const updateData = () => {
      switch(energyView) {
        case 'hourly':
          setEnergyData(getEnergyDataHourly());
          break;
        case 'daily':
          setEnergyData(dailyData);
          break;
        case 'weekly':
          setEnergyData(weeklyData);
          break;
        case 'monthly':
          setEnergyData(monthlyData);
          break;
        default:
          setEnergyData(getEnergyDataHourly());
      }
    };
    
    updateData();
    
    // Update hourly data every hour
    const interval = setInterval(updateData, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [energyView, dailyData, weeklyData, monthlyData]);

  // Update current time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const connectWebSocket = () => {
    try {
      const socket = new WebSocket(wsUrl);
      webSocketRef.current = socket;

      socket.onopen = () => console.log("✅ WebSocket connected");

      socket.onmessage = (msg) => {
        try {
          const json = JSON.parse(msg.data);
          if (json.type !== "state") return;
          if (json.deviceId !== deviceId) return;

          const { relay, value } = json;
          updateSwitchState(relay, value);
        } catch (err) {
          console.error("WebSocket message error:", err);
        }
      };

      socket.onerror = (err) => console.error("WebSocket error:", err);
      socket.onclose = () => {
        console.warn("WebSocket closed, attempting to reconnect...");
        setTimeout(() => {
          if (webSocketRef.current) {
            connectWebSocket();
          }
        }, 3000);
      };
    } catch (err) {
      console.error("WebSocket connection failed:", err);
    }
  };

  // Initialize Firebase and WebSocket
  useEffect(() => {
    fetchRelayData();
    fetchRoomMap();
    connectWebSocket();
    
    // Cleanup function
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, []);

  // Mock weather data
  const weatherData = {
    current: {
      temperature: 28, // Celsius
      condition: 'partly cloudy',
      humidity: 65,
      windSpeed: 10, // km/h
      precipitation: 0, // % chance
      uvIndex: 6,
      airQuality: 'good',
    },
    forecast: {
      today: {
        high: 32,
        low: 24,
        condition: 'partly cloudy',
        precipitation: 10,
      },
      tomorrow: {
        high: 30,
        low: 22,
        condition: 'cloudy',
        precipitation: 20,
      },
    },
  };

  const [themeMode, setThemeMode] = React.useState('dark');

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Update energy data based on view
  React.useEffect(() => {
    // Update energy data based on current view
    const updateData = () => {
      switch (energyView) {
        case 'hourly':
          setEnergyData(getEnergyDataHourly());
          break;
        case 'daily':
          setEnergyData(getEnergyDataDaily());
          break;
        case 'weekly':
          setEnergyData(getEnergyDataWeekly());
          break;
        case 'monthly':
          setEnergyData(getEnergyDataMonthly());
          break;
        default:
          setEnergyData(getEnergyDataMonthly());
      }
    };

    updateData();
    
    // Set appropriate update interval based on view
    let interval;
    switch (energyView) {
      case 'hourly':
        interval = 60 * 1000; // Update every minute
        break;
      case 'daily':
        interval = 60 * 60 * 1000; // Update every hour
        break;
      case 'weekly':
        interval = 24 * 60 * 60 * 1000; // Update every day
        break;
      case 'monthly':
        interval = 7 * 24 * 60 * 60 * 1000; // Update every week
        break;
    }

    const timer = setInterval(updateData, interval);
    return () => clearInterval(timer);
  }, [energyView]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Rule Triggered',
      message: 'Living Room AC turned ON due to temperature threshold',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      unread: true,
      type: 'info'
    },
    {
      id: 2,
      title: 'Energy Alert',
      message: 'High energy consumption detected in Kitchen',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      unread: true,
      type: 'warning'
    },
    {
      id: 3,
      title: 'Device Status',
      message: 'Bedroom Light turned OFF automatically',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      unread: false,
      type: 'success'
    }
  ]);

  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleNotificationRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const showToast = (message, severity = 'info') => {
    setToast({ open: true, message, severity });
  };

  const handleToastClose = () => {
    setToast({ ...toast, open: false });
  };

  // Add this function to generate notifications for device state changes
  const generateDeviceNotification = (room, device, status) => {
    const newNotification = {
      id: Date.now(),
      title: 'Device Status Change',
      message: `${room} ${device} turned ${status ? 'ON' : 'OFF'}`,
      timestamp: new Date(),
      unread: true,
      type: status ? 'success' : 'info'
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    showToast(newNotification.message, newNotification.type);
  };

  const WelcomeBanner = styled(Box)(({ theme }) => ({
    position: 'relative',
    backgroundColor: theme.palette.mode === 'dark' ? '#262626' : theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: '40px',
    borderRadius: '20px',
    marginBottom: '32px',
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    boxShadow: theme.shadows[3],
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[6],
    },
    '&::before': {
      content: "''",
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 'inherit',
      background: 'linear-gradient(135deg, rgba(45,45,45,0.1), rgba(45,45,45,0.05), rgba(45,45,45,0.1))',
      animation: 'wave 10s ease-in-out infinite',
      transform: 'rotate(45deg)',
      opacity: 0.5,
    },
    '@keyframes wave': {
      '0%': {
        backgroundPosition: '0% 50%',
        opacity: 0.5,
      },
      '50%': {
        backgroundPosition: '100% 50%',
        opacity: 0.3,
      },
      '100%': {
        backgroundPosition: '0% 50%',
        opacity: 0.5,
      },
    },
  }));

  // Add these styled components after the existing styled components
  const GlowingDot = styled('circle')(({ theme }) => ({
    filter: 'drop-shadow(0 0 8px rgba(144, 202, 249, 0.6))',
    transition: 'all 0.3s ease',
    '&:hover': {
      filter: 'drop-shadow(0 0 12px rgba(144, 202, 249, 0.8))',
      transform: 'scale(1.2)',
    },
  }));

  const AnimatedTooltip = styled('div')(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(8px)',
    padding: '12px 16px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(144, 202, 249, 0.3)',
    animation: 'pulse 2s infinite',
    '@keyframes pulse': {
      '0%': {
        boxShadow: '0 0 0 0 rgba(144, 202, 249, 0.4)',
      },
      '70%': {
        boxShadow: '0 0 0 10px rgba(144, 202, 249, 0)',
      },
      '100%': {
        boxShadow: '0 0 0 0 rgba(144, 202, 249, 0)',
      },
    },
    '& p': {
      margin: '0 0 8px 0',
      '&:last-child': {
        margin: 0,
      },
    },
    '& .label': {
      fontWeight: 'bold',
      color: theme.palette.text.primary,
    },
    '& .value': {
      color: theme.palette.primary.main,
      fontSize: '1.1em',
    },
    '& .timestamp': {
      color: theme.palette.text.secondary,
      fontSize: '0.85em',
      marginTop: '4px',
    },
  }));

  const [expandedSummary, setExpandedSummary] = useState(null);

  // Utility functions for device and room stats
  const getDeviceStats = (roomsData) => {
    let total = 0, on = 0;
    Object.values(roomsData).forEach(room => {
      if (room.devices) {
        total += room.devices.length;
        on += room.devices.filter(d => d.status).length;
      }
    });
    return { total, on };
  };
  
  const getRoomStats = (roomsData) => {
    let total = Object.keys(roomsData).length;
    let occupied = 0;
    Object.values(roomsData).forEach(room => {
      if (room.devices && room.devices.some(d => d.status)) occupied++;
    });
    return { total, occupied };
  };

  const deviceStats = getDeviceStats(roomsData);
  const roomStats = getRoomStats(roomsData);

  return (
    <Box sx={{ p: 3 }}>
      <DashboardBanner
        sx={(theme) => ({
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, #232526 0%, #414345 100%)'
            : 'linear-gradient(90deg, #e3f2fd 0%, #ffffff 100%)',
          color: theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : theme.palette.text.primary,
          borderRadius: 4,
          p: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 4,
          position: 'relative',
          overflow: 'hidden',
        })}
      >
        <Box>
          <Typography
            variant="h2"
            sx={(theme) => ({
              fontWeight: 800,
              color: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.dark,
              mb: 1,
            })}
          >
            {getTimeGreeting()}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={(theme) => ({
              color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : theme.palette.text.secondary,
              fontWeight: 400,
              mb: 2,
            })}
          >
            Welcome to your Smart Home Dashboard
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Box
            sx={(theme) => ({
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.85)',
              borderRadius: 3,
              p: 3,
              minWidth: 160,
              textAlign: 'center',
              border: `1.5px solid ${theme.palette.primary.main}`,
              fontFamily: "'Orbitron', monospace",
            })}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'inherit', mb: 0.5 }}>
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </Typography>
            <Typography variant="subtitle2" sx={(theme) => ({ color: theme.palette.primary.main, fontWeight: 500 })}>
              {currentTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </Typography>
            <Typography variant="caption" sx={(theme) => ({ color: theme.palette.text.secondary })}>
              {currentTime.toLocaleDateString('en-US', { weekday: 'long' })}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={(theme) => ({ color: theme.palette.primary.light, fontWeight: 700, mb: 1 })}>
              House Members
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {houseMembers.map((member) => (
                <Chip
                  key={member}
                  label={member}
                  avatar={<Avatar>{member[0]}</Avatar>}
                  sx={(theme) => ({
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(33,150,243,0.1)' : 'rgba(33,150,243,0.15)',
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    fontSize: '1rem',
                    px: 2,
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: theme.palette.primary.main, color: '#fff' },
                  })}
                />
              ))}
              <IconButton color="primary" sx={{ mt: 1 }}>
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </DashboardBanner>

      {/* Weather Card */}
      <Grid container spacing={4} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#23272a' : '#f5f7fa',
              minHeight: 280,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Current Weather <span style={{ color: '#90caf9' }}>({weatherData.current.condition})</span>
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr' },
                gap: 2,
              }}
            >
              {/* Weather metrics here */}
              <WeatherCard>
                <WbSunnyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h6">{weatherData.current.temperature}°C</Typography>
                <Typography variant="caption" color="text.secondary">Temperature</Typography>
              </WeatherCard>
              <WeatherCard>
                <WaterDropIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h6">{weatherData.current.humidity}%</Typography>
                <Typography variant="caption" color="text.secondary">Humidity</Typography>
              </WeatherCard>
              <WeatherCard>
                <WindIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h6">{weatherData.current.windSpeed} km/h</Typography>
                <Typography variant="caption" color="text.secondary">Wind Speed</Typography>
              </WeatherCard>
              <WeatherCard>
                <UmbrellaIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h6">{weatherData.current.precipitation}%</Typography>
                <Typography variant="caption" color="text.secondary">Precipitation</Typography>
              </WeatherCard>
            </Box>
          </Paper>
        </Grid>

        {/* Welcome and Refresh Section */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#23272a' : '#f5f7fa',
              minHeight: 280,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Welcome, {currentUsername}
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => { fetchRelayData(); fetchRoomMap(); }}
              >
                Refresh
              </Button>
            </Box>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Manage your smart home devices and monitor energy consumption
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click refresh to update device status and room configurations
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Room Controls and Energy Consumption */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Room Controls
              </Typography>
              {Object.entries(relays).map(([roomName, items]) => (
                <RoomSection key={roomName}>
                  <RoomHeader>
                    <Box className="room-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>{roomName}</Typography>
                        <Box
                          sx={(theme) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            background: theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.05)'
                              : 'rgba(0, 0, 0, 0.02)',
                            borderRadius: 1,
                            px: 1.5,
                            py: 0.5,
                            border: `1px solid ${theme.palette.divider}`,
                            backdropFilter: 'blur(5px)',
                          })}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={(theme) => ({ color: theme.palette.success.main })}
                          >
                            {items.filter(relay => relayStates[relay] === "ON").length} ON
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={(theme) => ({ color: theme.palette.error.main })}
                          >
                            {items.filter(relay => relayStates[relay] !== "ON").length} OFF
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton onClick={(e) => { setAnchorEl(e.currentTarget); setRoomOptionsRoom(roomName); }}>
                        <MoreVertIcon style={{ color: "white" }} />
                      </IconButton>
                    </Box>
                  </RoomHeader>
                  <Box sx={{ p: 2 }}>
                    <RoomSummary>
                      <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
                        {items.filter(relay => relayStates[relay] === "ON").length} ON
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: 'error.main' }}>
                        {items.filter(relay => relayStates[relay] !== "ON").length} OFF
                      </Typography>
                    </RoomSummary>
                    <Box sx={{ mt: 2 }}>
                      {items.map(relay => {
                        const key = `${roomName}_${relay}`;
                        return (
                          <DeviceCard key={key} status={relayStates[relay] === "ON"}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <DeviceStatusBadge status={relayStates[relay] === "ON"} />
                              <DeviceIcon sx={{ color: relayStates[relay] === "ON" ? 'success.main' : 'error.main' }}>
                                {getDeviceIcon(relay)}
                              </DeviceIcon>
                              <Typography variant="subtitle1" sx={{ flex: 1 }}>{relay}</Typography>
                              <Switch
                                color="primary"
                                checked={relayStates[relay] === "ON"}
                                inputRef={(el) => (switchRefs.current[key] = el)}
                                onMouseDown={() => (userInitiatedMap.current[key] = true)}
                                onChange={(e) => handleSwitchChange(relay, roomName, e.target.checked)}
                              />
                            </Box>
                          </DeviceCard>
                        );
                      })}
                    </Box>
                  </Box>
                </RoomSection>
              ))}
              
              <Box mt={4} display="flex" justifyContent="center">
                <Button variant="outlined" color="secondary" onClick={() => openRoomDialog("")}>
                  Add Room
                </Button>
              </Box>
            </StyledPaper>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StyledPaper>
              {/* New Block: Device and Room Stats */}
              <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 3,
                mb: 4,
                p: 3,
                borderRadius: 3,
                background: 'rgba(255,255,255,0.03)',
                boxShadow: 2,
              }}>
                <Box>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Devices ON / Total
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {deviceStats.on} / {deviceStats.total}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Occupied Rooms / Total
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                    {roomStats.occupied} / {roomStats.total}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="h5" 
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <ElectricBoltIcon color="primary" />
                  Energy Consumption
                </Typography>
                <StyledButtonGroup sx={{ mb: 2 }}>
                  {['hourly', 'daily', 'weekly', 'monthly'].map((view) => (
                    <Button
                      key={view}
                      variant={energyView === view ? 'contained' : 'outlined'}
                      onClick={() => setEnergyView(view)}
                      startIcon={
                        view === 'hourly' ? <AccessTimeIcon /> :
                        view === 'daily' ? <CalendarTodayIcon /> :
                        view === 'weekly' ? <DateRangeIcon /> :
                        <CalendarMonthIcon />
                      }
                    >
                      {view}
                    </Button>
                  ))}
                </StyledButtonGroup>
              </Box>
              <Box sx={{ height: 400, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart 
                    data={energyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#90caf9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#90caf9" stopOpacity={0.1}/>
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <RechartsCartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="rgba(144, 202, 249, 0.1)"
                    />
                    <RechartsXAxis 
                      dataKey="label" 
                      stroke="rgba(144, 202, 249, 0.5)"
                      tick={{ fill: 'rgba(144, 202, 249, 0.7)' }}
                    />
                    <RechartsYAxis 
                      label={{ 
                        value: 'Consumption (kW)', 
                        angle: -90, 
                        position: 'insideLeft',
                        fill: 'rgba(144, 202, 249, 0.7)'
                      }}
                      domain={
                        energyView === 'hourly' ? [0, 2.5] : 
                        energyView === 'daily' ? [0, 45] :
                        energyView === 'weekly' ? [0, 250] :
                        [0, 1200]
                      }
                      tickCount={6}
                      tickFormatter={(value) => 
                        energyView === 'hourly' ? value.toFixed(1) : 
                        value % 1 === 0 ? value.toString() : value.toFixed(1)
                      }
                      stroke="rgba(144, 202, 249, 0.5)"
                      tick={{ fill: 'rgba(144, 202, 249, 0.7)' }}
                    />
                    <RechartsTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const value = payload[0].value;
                          const timestamp = payload[0].payload.timestamp;
                          return (
                            <AnimatedTooltip>
                              <p className="label">{label}</p>
                              <p className="value">
                                Power: {value.toFixed(2)} kW
                              </p>
                              <p className="timestamp">
                                {timestamp ? new Date(timestamp).toLocaleString() : 
                                 energyView === 'hourly' ? 'Current hour' : 
                                 energyView === 'daily' ? 'Daily total' : 
                                 energyView === 'weekly' ? 'Weekly total' : 'Monthly total'}
                              </p>
                            </AnimatedTooltip>
                          );
                        }
                        return null;
                      }}
                      cursor={{
                        stroke: 'rgba(144, 202, 249, 0.3)',
                        strokeWidth: 2,
                        strokeDasharray: '5 5',
                      }}
                    />
                    <RechartsLine 
                      type="monotone" 
                      dataKey="consumption" 
                      stroke="#90caf9"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{
                        r: 8,
                        stroke: '#90caf9',
                        strokeWidth: 2,
                        fill: '#fff',
                        filter: 'url(#glow)',
                      }}
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    />
                    <RechartsLine 
                      type="monotone" 
                      dataKey="consumption" 
                      stroke="url(#lineGradient)"
                      strokeWidth={20}
                      dot={false}
                      activeDot={false}
                      opacity={0.1}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </Box>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {/* Today's Summary */}
                <SummaryCard>
                  <SummaryHeader onClick={() => setExpandedSummary(expandedSummary === 'today' ? null : 'today')}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TodayIcon color="primary" />
                      <Typography variant="h6">Today's Energy Summary</Typography>
                    </Box>
                    <IconButton size="small">
                      {expandedSummary === 'today' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </SummaryHeader>
                  <Collapse in={expandedSummary === 'today'}>
                    <SummaryContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h4" color="primary" sx={{ flexGrow: 1 }}>
                          {hourlyData.reduce((sum, hour) => sum + hour.consumption, 0).toFixed(1)} kW
                        </Typography>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h5" color="error">
                            ₹{(
                              hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) * 8
                            ).toFixed(2)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            @ ₹8/kWh
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </Typography>
                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(144, 202, 249, 0.1)' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Today's Peak: {(
                            Math.max(...hourlyData.map(h => h.consumption))
                          ).toFixed(1)} kW
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          Today's Average: {(
                            hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) / 24
                          ).toFixed(1)} kW
                        </Typography>
                      </Box>
                    </SummaryContent>
                  </Collapse>
                </SummaryCard>

                {/* Yesterday's Summary */}
                <SummaryCard>
                  <SummaryHeader onClick={() => setExpandedSummary(expandedSummary === 'yesterday' ? null : 'yesterday')}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HistoryIcon color="primary" />
                      <Typography variant="h6">Yesterday's Energy Summary</Typography>
                    </Box>
                    <IconButton size="small">
                      {expandedSummary === 'yesterday' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </SummaryHeader>
                  <Collapse in={expandedSummary === 'yesterday'}>
                    <SummaryContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h4" color="primary" sx={{ flexGrow: 1 }}>
                          {(hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) * 0.85).toFixed(1)} kW
                        </Typography>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h5" color="error">
                            ₹{((hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) * 0.85) * 8).toFixed(2)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            @ ₹8/kWh
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(Date.now() - 86400000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </Typography>
                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(144, 202, 249, 0.1)' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Yesterday's Peak: {(Math.max(...hourlyData.map(h => h.consumption)) * 0.9).toFixed(1)} kW
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          Yesterday's Average: {((hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) / 24) * 0.85).toFixed(1)} kW
                        </Typography>
                        <Typography 
                          variant="subtitle2" 
                          color={hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) > 
                            (hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) * 0.85) ? 'error' : 'success.main'}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0.5,
                            mt: 1,
                            fontWeight: 600,
                          }}
                        >
                          {hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) > 
                          (hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) * 0.85) ? 
                          <TrendingUpIcon color="error" /> : 
                          <TrendingDownIcon color="success" />}
                          {hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) > 
                          (hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) * 0.85) ? 
                          ((hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) / (hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) * 0.85) * 100) - 100).toFixed(1) + 
                          '% higher than yesterday' : 
                          (100 - (hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) / (hourlyData.reduce((sum, hour) => sum + hour.consumption, 0) * 0.85) * 100)).toFixed(1) + 
                          '% lower than yesterday'}
                        </Typography>
                      </Box>
                    </SummaryContent>
                  </Collapse>
                </SummaryCard>
              </Stack>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <ViewAllButton
                  variant="contained"
                  onClick={() => navigate('/energy-details')}
                  startIcon={<AnalyticsIcon />}
                >
                  View All Energy Details
                </ViewAllButton>
              </Box>
            </StyledPaper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Temperature Display */}
      <Grid item xs={12} md={6}>
        <TemperatureDisplay roomsData={roomsData} selectedRoom={selectedRoom} setRoomsData={setRoomsData} />
      </Grid>



    {/* Notification Bell and Menu */}
    <Box sx={{ 
      position: 'absolute', 
      top: 20, 
      right: 20, 
      zIndex: 1000 
    }}>
      <NotificationBell
        hasNotifications={notifications.some(n => n.unread)}
        onClick={handleNotificationClick}
        size="large"
      >
        <Badge 
          badgeContent={notifications.filter(n => n.unread).length} 
          color="error"
        >
          <NotificationsIcon />
        </Badge>
      </NotificationBell>
      
      <NotificationMenu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationClose}
        TransitionComponent={Fade}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            unread={notification.unread}
            onClick={() => handleNotificationRead(notification.id)}
          >
            <Box className="notification-content">
              <Typography className="notification-title">
                {notification.title}
              </Typography>
              <Typography className="notification-message">
                {notification.message}
              </Typography>
              <Typography className="notification-time">
                {notification.timestamp.toLocaleTimeString()}
              </Typography>
            </Box>
          </NotificationItem>
        ))}
      </NotificationMenu>
      
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={Slide}
      >
        <Alert 
          onClose={handleToastClose} 
          severity={toast.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            backdropFilter: 'blur(8px)',
            '& .MuiAlert-icon': {
              animation: 'pulse 2s infinite',
            },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>

    {/* Room Management Dialog */}
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
      <DialogTitle>{selectedRoom ? `Edit Room: ${selectedRoom}` : "Add New Room"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Room Name"
          fullWidth
          margin="normal"
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
          disabled={!!relays[selectedRoom]}
        />
        <Box>
          {(() => {
            // If editing an existing room, show relays assigned to this room and unassigned relays
            if (selectedRoom && relays[selectedRoom]) {
              const assignedRelays = relays[selectedRoom];
              const assignedToOtherRooms = Object.entries(relays)
                .filter(([room]) => room !== selectedRoom)
                .flatMap(([, relaysList]) => relaysList);
              const unassignedRelays = allRelays.filter(r => !assignedToOtherRooms.includes(r) && !assignedRelays.includes(r));
              const relaysToShow = [...assignedRelays, ...unassignedRelays];
              if (relaysToShow.length === 0) {
                return (
                  <Typography color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                    No relays are available for this room.
                  </Typography>
                );
              }
              return (
                <>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Select relays for this room (checked = assigned to this room)
                  </Typography>
                  {relaysToShow.map((relay) => (
                    <FormControlLabel
                      key={relay}
                      control={
                        <Checkbox
                          checked={!!checkedRelays[relay]}
                          onChange={(e) =>
                            setCheckedRelays(prev => ({ ...prev, [relay]: e.target.checked }))
                          }
                        />
                      }
                      label={relay}
                    />
                  ))}
                </>
              );
            } else {
              // If creating a new room, only show unassigned relays
              const assignedRelays = Object.values(relays).flat();
              const unassignedRelays = allRelays.filter(r => !assignedRelays.includes(r));
              if (unassignedRelays.length === 0) {
                return (
                  <Typography color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                    All relays are already assigned to rooms. Remove relays from existing rooms to create new ones.
                  </Typography>
                );
              }
              return (
                <>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Select relays for the new room (only unassigned relays shown)
                  </Typography>
                  {unassignedRelays.map((relay) => (
                    <FormControlLabel
                      key={relay}
                      control={
                        <Checkbox
                          checked={!!checkedRelays[relay]}
                          onChange={(e) =>
                            setCheckedRelays(prev => ({ ...prev, [relay]: e.target.checked }))
                          }
                        />
                      }
                      label={relay}
                    />
                  ))}
                </>
              );
            }
          })()}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        <Button onClick={saveRoomRelays} variant="contained" color="primary">Save</Button>
      </DialogActions>
    </Dialog>

    {/* Room Options Menu */}
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
    >
      <MenuItem onClick={() => openRoomDialog(roomOptionsRoom)}>Edit</MenuItem>
      <MenuItem onClick={deleteRoom}>Remove</MenuItem>
    </Menu>
  </Box>
  );
};

export default Dashboard;
