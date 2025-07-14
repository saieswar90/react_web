import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  Button,
  TextField,
  IconButton,
  Card,
  CardContent,
  Divider,
  Chip,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Switch,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import TimelineIcon from '@mui/icons-material/Timeline';
import LanguageIcon from '@mui/icons-material/Language';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PersonIcon from '@mui/icons-material/Person';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  backdropFilter: 'blur(10px)',
  borderRadius: 24,
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  boxShadow: theme.shadows[8],
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  fontSize: 48,
  fontWeight: 'bold',
  boxShadow: theme.shadows[8],
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.05) rotate(360deg)',
  },
}));

const InfoCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
  borderRadius: 12,
    backgroundColor: alpha(theme.palette.background.paper, 0.6),
    '&:hover': {
      backgroundColor: alpha(theme.palette.background.paper, 0.8),
    },
  },
}));

const TimelineItem = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingLeft: theme.spacing(4),
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: theme.palette.primary.main,
    opacity: 0.2,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    left: -4,
    top: 0,
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
  },
}));

const UserProfile = ({ onNavigate }) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = React.useState(false);
  const [userData, setUserData] = React.useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Smart Home Street',
    role: 'Admin',
    joinDate: 'May 15, 2025',
  });
  const [activeTab, setActiveTab] = React.useState('profile');
  const [settings, setSettings] = React.useState({
    darkMode: theme.palette.mode === 'dark',
    notifications: true,
    language: 'English',
    securityLevel: 'high',
  });
  const [showPasswordDialog, setShowPasswordDialog] = React.useState(false);
  const [show2FADialog, setShow2FADialog] = React.useState(false);
  const [passwordData, setPasswordData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notificationSnackbar, setNotificationSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const recentActivity = [
    { date: '2025-05-20', action: 'Updated profile information', icon: <EditIcon /> },
    { date: '2025-05-19', action: 'Changed security settings', icon: <SecurityIcon /> },
    { date: '2025-05-18', action: 'Logged in from new device', icon: <NotificationsIcon /> },
  ];

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the data to your backend
    console.log('Saving user data:', userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data if needed
  };

  const handleChange = (field) => (event) => {
    setUserData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSettingChange = (setting) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));

    // Handle dark mode toggle
    if (setting === 'darkMode') {
      onNavigate('Settings', { themeMode: value ? 'dark' : 'light' });
    }

    // Handle notifications toggle
    if (setting === 'notifications') {
      setNotificationSnackbar({
        open: true,
        message: value ? 'Notifications enabled' : 'Notifications disabled',
        severity: 'success'
      });
      // Here you would typically make an API call to update notification preferences
      console.log('Notification settings updated:', value);
    }
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    // Here you would typically make an API call to change the password
    console.log('Changing password:', passwordData);
    setShowPasswordDialog(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handle2FAToggle = () => {
    // Here you would typically make an API call to toggle 2FA
    console.log('Toggling 2FA');
    setShow2FADialog(false);
  };

  const handleCloseSnackbar = () => {
    setNotificationSnackbar(prev => ({ ...prev, open: false }));
  };

  const renderProfileContent = () => (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
        <InfoCard>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon sx={{ mr: 1 }} />
              Contact Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 3 }}>
              {isEditing ? (
                <StyledTextField
                  fullWidth
                  label="Email"
                  value={userData.email}
                  onChange={handleChange('email')}
                  sx={{ mb: 2 }}
                />
              ) : (
                <Typography sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                  {userData.email}
                </Typography>
              )}
              {isEditing ? (
                <StyledTextField
                  fullWidth
                  label="Phone"
                  value={userData.phone}
                  onChange={handleChange('phone')}
                />
              ) : (
                <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                  {userData.phone}
                </Typography>
              )}
            </Box>
          </CardContent>
        </InfoCard>
          </Grid>

          <Grid item xs={12} md={6}>
        <InfoCard>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOnIcon sx={{ mr: 1 }} />
              Address
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 3 }}>
              {isEditing ? (
                <StyledTextField
                  fullWidth
                  label="Address"
                  value={userData.address}
                  onChange={handleChange('address')}
                  multiline
                  rows={2}
                />
              ) : (
                <Typography sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <LocationOnIcon sx={{ mr: 1, color: 'primary.main', mt: 0.5 }} />
                  {userData.address}
                </Typography>
              )}
            </Box>
          </CardContent>
        </InfoCard>
          </Grid>

          <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              {isEditing ? (
                <>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                sx={{ borderRadius: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                sx={{ borderRadius: 2 }}
                  >
                Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
              sx={{ borderRadius: 2 }}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
  );

  const renderSettingsContent = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <InfoCard>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <SettingsIcon sx={{ mr: 1 }} />
              General Settings
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DarkModeIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography sx={{ flex: 1 }}>Dark Mode</Typography>
                <Switch
                  checked={settings.darkMode}
                  onChange={handleSettingChange('darkMode')}
                  color="primary"
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography sx={{ flex: 1 }}>Notifications</Typography>
                <Switch
                  checked={settings.notifications}
                  onChange={handleSettingChange('notifications')}
                  color="primary"
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LanguageIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography sx={{ flex: 1 }}>Language</Typography>
                <Select
                  value={settings.language}
                  onChange={handleSettingChange('language')}
                  size="small"
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Spanish">Spanish</MenuItem>
                  <MenuItem value="French">French</MenuItem>
                </Select>
              </Box>
            </Box>
          </CardContent>
        </InfoCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <InfoCard>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <SecurityIcon sx={{ mr: 1 }} />
              Security Settings
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography sx={{ flex: 1 }}>Security Level</Typography>
                <Select
                  value={settings.securityLevel}
                  onChange={handleSettingChange('securityLevel')}
                  size="small"
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </Box>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => setShowPasswordDialog(true)}
              >
                Change Password
              </Button>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => setShow2FADialog(true)}
              >
                Two-Factor Authentication
              </Button>
            </Box>
          </CardContent>
        </InfoCard>
      </Grid>

      {/* Password Change Dialog */}
      <Dialog
        open={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained" color="primary">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* 2FA Dialog */}
      <Dialog
        open={show2FADialog}
        onClose={() => setShow2FADialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Two-Factor Authentication</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom>
              Enable two-factor authentication to add an extra layer of security to your account.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              You'll need to enter a verification code each time you sign in.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <QRCodeSVG value="otpauth://totp/Example:alex@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Example" size={200} />
            </Box>
            <TextField
              fullWidth
              label="Verification Code"
              placeholder="Enter 6-digit code"
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShow2FADialog(false)}>Cancel</Button>
          <Button onClick={handle2FAToggle} variant="contained" color="primary">
            Enable 2FA
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );

  const renderActivityContent = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <InfoCard>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <TimelineIcon sx={{ mr: 1 }} />
              Recent Activity
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 3 }}>
              {recentActivity.map((activity, index) => (
                <TimelineItem key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {activity.date}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {activity.icon}
                    <Typography sx={{ ml: 1 }}>{activity.action}</Typography>
                  </Box>
                </TimelineItem>
              ))}
            </Box>
          </CardContent>
        </InfoCard>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: 4, minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StyledPaper>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <ProfileAvatar>
                {userData.name.split(' ').map(n => n[0]).join('')}
              </ProfileAvatar>
            </motion.div>
            <Box sx={{ ml: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                {userData.name}
              </Typography>
              <Chip
                icon={<WorkIcon />}
                label={userData.role}
                color="primary"
                sx={{ mr: 2 }}
              />
              <Chip
                icon={<CalendarTodayIcon />}
                label={`Joined: ${userData.joinDate}`}
                color="secondary"
              />
            </Box>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 'bold',
                },
              }}
            >
              <Tab
                label="Profile"
                value="profile"
                icon={<PersonIcon />}
                iconPosition="start"
              />
              <Tab
                label="Settings"
                value="settings"
                icon={<SettingsIcon />}
                iconPosition="start"
              />
              <Tab
                label="Activity"
                value="activity"
                icon={<TimelineIcon />}
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'profile' && renderProfileContent()}
              {activeTab === 'settings' && renderSettingsContent()}
              {activeTab === 'activity' && renderActivityContent()}
            </motion.div>
          </AnimatePresence>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => onNavigate('Dashboard')}
              sx={{ borderRadius: 2 }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </StyledPaper>
      </motion.div>
      <Snackbar
        open={notificationSnackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={notificationSnackbar.severity}
          sx={{ width: '100%' }}
        >
          {notificationSnackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;
