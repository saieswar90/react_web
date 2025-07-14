import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Switch, 
  FormControlLabel, 
  Button, 
  Divider, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Select, 
  MenuItem, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import {
  AccountCircle,
  DarkMode,
  Notifications,
  Devices,
  Schedule,
  Info,
  Lock,
  Edit,
  Logout,
  Language,
  Add,
  Support,
  Security,
  Rule
} from '@mui/icons-material';

const Settings = ({ onThemeChange, onLogout }) => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [language, setLanguage] = useState('English');
  const [languageChanged, setLanguageChanged] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const handleDarkModeToggle = (event) => {
    const isDarkMode = event.target.checked;
    onThemeChange(isDarkMode ? 'dark' : 'light');
  };

  const handleNavigate = (path) => {
    setSnackbar({ open: true, message: `${path} would be opened in a real app` });
  };

  const handleLogout = () => {
    onLogout();
    setLogoutDialogOpen(false);
  };

  const SettingSection = ({ title, icon, children }) => (
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 1 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {React.cloneElement(icon, { color: 'primary', sx: { mr: 1 } })}
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {children}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      {/* Account Section */}
      <SettingSection title="Account" icon={<AccountCircle />}>
        <List>
          <ListItem button onClick={() => handleNavigate('change-password')}>
            <ListItemIcon><Lock /></ListItemIcon>
            <ListItemText primary="Change Password" />
          </ListItem>
          <ListItem button onClick={() => handleNavigate('edit-profile')}>
            <ListItemIcon><Edit /></ListItemIcon>
            <ListItemText primary="Edit Profile" />
          </ListItem>
          <ListItem button onClick={() => setLogoutDialogOpen(true)}>
            <ListItemIcon><Logout /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </SettingSection>

      {/* Appearance Section */}
      <SettingSection title="Appearance" icon={<DarkMode />}>
        <FormControlLabel
          control={
            <Switch
              checked={theme.palette.mode === 'dark'}
              onChange={handleDarkModeToggle}
              color="primary"
            />
          }
          label="Dark Mode"
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Language sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body1" sx={{ minWidth: 120 }}>Language</Typography>
          <Select
            value={language}
            onChange={(e) => {
              const newLanguage = e.target.value;
              setLanguage(newLanguage);
              setLanguageChanged(true);
              // Show a message when language is changed
              setSnackbar({
                open: true,
                message: `Language changed to ${newLanguage}. App restart may be required.`
              });
            }}
            variant="outlined"
            size="small"
            sx={{ minWidth: 120, ml: 2 }}
            displayEmpty={false}
          >
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Hindi">हिंदी</MenuItem>
            <MenuItem value="Spanish">Español</MenuItem>
            <MenuItem value="French">Français</MenuItem>
          </Select>
          {languageChanged && (
            <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
              Note: Some language changes may require app restart to take effect
            </Typography>
          )}
        </Box>
      </SettingSection>

      {/* Notifications Section */}
      <SettingSection title="Notifications" icon={<Notifications />}>
        <FormControlLabel
          control={
            <Switch
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              color="primary"
            />
          }
          label="Enable Notifications"
          sx={{ display: 'block', mb: 1 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={sounds}
              onChange={(e) => setSounds(e.target.checked)}
              color="primary"
              disabled={!notifications}
            />
          }
          label="Enable Sound for Alerts"
        />
      </SettingSection>

      {/* Devices Section */}
      <SettingSection title="Devices" icon={<Devices />}>
        <Button
          variant="outlined"
          startIcon={<Devices />}
          sx={{ mr: 2, mb: 2 }}
          onClick={() => handleNavigate('manage-devices')}
        >
          Manage Paired Devices
        </Button>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleNavigate('add-device')}
        >
          Add New Device
        </Button>
      </SettingSection>

      {/* Automation Section */}
      <SettingSection title="Automation" icon={<Rule />}>
        <Button
          variant="text"
          startIcon={<Rule />}
          sx={{ display: 'block', textAlign: 'left', mb: 1 }}
          onClick={() => handleNavigate('automation-rules')}
        >
          View/Edit Automation Rules
        </Button>
        <Button
          variant="text"
          startIcon={<Schedule />}
          sx={{ display: 'block', textAlign: 'left' }}
          onClick={() => handleNavigate('scheduled-tasks')}
        >
          View Scheduled Tasks
        </Button>
      </SettingSection>

      {/* About Section */}
      <SettingSection title="About" icon={<Info />}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          App Version: 1.0.0
        </Typography>
        <Button
          variant="text"
          startIcon={<Support />}
          sx={{ display: 'block', textAlign: 'left', mb: 1 }}
          onClick={() => handleNavigate('support')}
        >
          Contact Support
        </Button>
        <Button
          variant="text"
          startIcon={<Security />}
          sx={{ display: 'block', textAlign: 'left' }}
          onClick={() => handleNavigate('privacy')}
        >
          Privacy Policy / Terms of Use
        </Button>
      </SettingSection>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleLogout} color="primary" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity="info">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
