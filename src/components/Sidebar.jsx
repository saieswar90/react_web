import React from 'react';
import { styled, useTheme, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import SecurityIcon from '@mui/icons-material/Security';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import LogoutIcon from '@mui/icons-material/Logout';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 280;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    background: theme.palette.mode === 'dark' 
      ? alpha(theme.palette.background.paper, 0.9)
      : alpha(theme.palette.background.paper, 0.9),
    backdropFilter: 'blur(10px)',
    borderRight: `1px solid ${theme.palette.mode === 'dark' 
      ? alpha(theme.palette.divider, 0.1)
      : alpha(theme.palette.divider, 0.1)}`,
    boxShadow: theme.shadows[4],
  },
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  margin: '8px 16px',
  borderRadius: 16,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: active 
    ? theme.palette.mode === 'dark'
      ? alpha(theme.palette.primary.main, 0.1)
      : alpha(theme.palette.primary.main, 0.1)
    : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.primary.main, 0.1)
      : alpha(theme.palette.primary.main, 0.1),
    transform: 'translateX(8px)',
  },
  '& .MuiListItemIcon-root': {
    minWidth: 40,
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  },
  '& .MuiListItemText-primary': {
    fontWeight: active ? 'bold' : 'normal',
    color: active ? theme.palette.primary.main : theme.palette.text.primary,
  },
}));

const ThemeToggle = styled(IconButton)(({ theme }) => ({
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'rotate(180deg)',
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.primary.main, 0.1)
      : alpha(theme.palette.primary.main, 0.1),
  },
}));

const menuItems = ({ isAuthenticated, isGuest }) => [
  ...(isAuthenticated ? [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    ...(isGuest ? [] : [
      { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    ]),
    { text: 'Home', icon: <HomeIcon />, path: '/home' },
    { text: 'Messages', icon: <MessageIcon />, path: '/messages' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
  ] : []),
  ...(isAuthenticated && !isGuest ? [
    { text: 'Logout', icon: <LogoutIcon />, path: '/logout' }
  ] : [
    { text: 'Login', icon: <LoginIcon />, path: '/login' }
  ])
];

export default function Sidebar({ currentPage, setCurrentPage, authenticated, isGuest, themeMode, setThemeMode, onLogout }) {
  const theme = useTheme();
  const location = useLocation();

  const items = menuItems({ isAuthenticated: authenticated, isGuest });

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <StyledDrawer variant="permanent">
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 3,
        borderBottom: `1px solid ${theme.palette.mode === 'dark' 
          ? alpha(theme.palette.divider, 0.1)
          : alpha(theme.palette.divider, 0.1)}`,
      }}>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Smart Home
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
          <ThemeToggle onClick={toggleTheme} size="small">
            {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </ThemeToggle>
        </Box>
      </Box>

      {authenticated && !isGuest && (
        <>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
              }}
            >
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                John Doe
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Administrator
              </Typography>
            </Box>
          </Box>
          <Divider />
        </>
      )}

      <List sx={{ px: 2, py: 1 }}>
        {items.map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <StyledListItem 
              button 
              component={Link}
              to={item.path}
              active={location.pathname === item.path ? 1 : 0}
            >
              <ListItemIcon>
                {item.text === 'Messages' ? (
                  <Badge badgeContent={3} color="error">
                {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </StyledListItem>
          </motion.div>
        ))}
      </List>
    </StyledDrawer>
  );
}
