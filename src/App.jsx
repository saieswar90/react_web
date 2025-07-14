import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Login from './components/Login';
import Registration from './components/Registration';
import Messages from './components/Messages';
import DeviceDiscovery from './components/DeviceDiscovery';
import UserProfile from './components/UserProfile';
import Settings from './components/Settings';
import EnergyDetails from './components/EnergyDetails';
import Logout from './components/Logout';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
});

const AppContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: 240, // Width of the sidebar
}));


// Initial room data shared between components
const initialRoomsData = {
  'Living Room': {
    devices: [
      { name: 'Smart TV', status: true },
      { name: 'Only Smart TV', status: false },
      { name: 'Air Conditioner', status: false },
      { name: 'Smart Lights', status: true },
    ]
  },
  'Kitchen': {
    devices: [
      { name: 'Refrigerator', status: true },
      { name: 'Oven', status: false },
      { name: 'Dishwasher', status: false },
    ]
  },
  'Bedroom': {
    devices: [
      { name: 'Smart Lights', status: true },
      { name: 'Air Conditioner', status: true },
      { name: 'Smart Fan', status: false },
    ]
  },
  'Bathroom': {
    devices: [
      { name: 'Smart Lights', status: true },
      { name: 'Water Heater', status: true },
      { name: 'Smart Mirror', status: false },
    ]
  }
};

function AppContent({ themeMode, setThemeMode }) {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [currentPage, setCurrentPage] = useState('Login');
  const [roomsData, setRoomsData] = useState(initialRoomsData);
  const [username, setUsername] = useState('User');

  // Initialize with Login page if not authenticated
  useEffect(() => {
    if (!authenticated && currentPage !== 'Login' && currentPage !== 'Register') {
      setCurrentPage('Login');
    }
  }, [authenticated, currentPage]);

  const handleLogin = (guest) => {
    setAuthenticated(true);
    setIsGuest(!!guest);
    setCurrentPage('DeviceDiscovery');
    navigate('/device-discovery');
  };

  const handleRegister = (guest) => {
    setAuthenticated(true);
    setIsGuest(!!guest);
    setCurrentPage('DeviceDiscovery');
    navigate('/device-discovery');
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setIsGuest(false);
    setDiscoveredDevices([]);
    setRoomsData(initialRoomsData);
    setCurrentPage('Login');
    navigate('/login');
  };

  const handleDiscoveryComplete = (devices) => {
    setDiscoveredDevices(devices);
    setCurrentPage('Dashboard');
    navigate('/dashboard');
  };

  const handlePageChange = (page, options = {}) => {
    setCurrentPage(page);
    if (options.themeMode) {
      setThemeMode(options.themeMode);
    }
    navigate(`/${page.toLowerCase()}`);
  };

  return (
    <>
      {authenticated ? (
        <AppContainer>
          <Sidebar
            currentPage={currentPage}
            setCurrentPage={handlePageChange}
            authenticated={authenticated}
            isGuest={isGuest}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            onLogout={handleLogout}
          />
          <MainContent>
            <Routes>
              <Route 
                path="/" 
                element={<Navigate to="/dashboard" replace />} 
              />
              <Route 
                path="/device-discovery" 
                element={
                  <DeviceDiscovery 
                    onDiscoveryComplete={handleDiscoveryComplete}
                    roomsData={roomsData}
                    setRoomsData={setRoomsData}
                  />
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <Dashboard 
                    roomsData={roomsData} 
                    setRoomsData={setRoomsData} 
                    themeMode={themeMode}
                    setThemeMode={setThemeMode}
                    username={username}
                    discoveredDevices={discoveredDevices}
                  />
                } 
              />
              <Route 
                path="/profile" 
                element={<UserProfile onNavigate={handlePageChange} />} 
              />
              <Route 
                path="/home" 
                element={<Home roomsData={roomsData} setRoomsData={setRoomsData} />} 
              />
              <Route 
                path="/messages" 
                element={<Messages isGuest={isGuest} />} 
              />
              <Route 
                path="/settings" 
                element={
                  <Settings 
                    onThemeChange={setThemeMode}
                    onLogout={handleLogout}
                  />
                } 
              />
              <Route 
                path="/energy-details" 
                element={<EnergyDetails />} 
              />
              <Route 
                path="/logout" 
                element={<Logout onLogout={handleLogout} />} 
              />
            </Routes>
          </MainContent>
        </AppContainer>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Registration onRegister={handleRegister} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  const [themeMode, setThemeMode] = useState('dark');
  
  return (
    <BrowserRouter>
      <ThemeProvider theme={themeMode === 'dark' ? darkTheme : lightTheme}>
        <CssBaseline />
        <AppContent themeMode={themeMode} setThemeMode={setThemeMode} />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
