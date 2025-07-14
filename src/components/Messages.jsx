import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  Collapse,
  Card,
  CardContent,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  Menu,
  Checkbox,
  ButtonGroup
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  NotificationsActive as PushIcon,
  Archive as ArchiveIcon,
  MarkEmailRead as MarkReadIcon,
  Sort as SortIcon,
  Search as SearchIcon,
  Info as InfoIcon,
  MoreVert as MoreVertIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Flag as FlagIcon,
  FlagOutlined as FlagOutlinedIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationItem = ({ notification, onDismiss, onDelete, onToggleSelect, isSelected }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const getIcon = (type) => {
    switch (type) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      default:
        return <NotificationsIcon color="info" />;
    }
  };

  const getSeverity = (type) => {
    switch (type) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        elevation={1}
        sx={{
          mb: 2,
          borderRadius: 2,
          overflow: 'hidden',
          borderLeft: `4px solid ${
            notification.type === 'error' ? theme.palette.error.main : 
            notification.type === 'warning' ? theme.palette.warning.main : 
            theme.palette.info.main
          }`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4],
          }
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              {getIcon(notification.type)}
            </ListItemIcon>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {notification.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(notification.timestamp).toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                {notification.message}
              </Typography>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box sx={{ 
                  mt: 1, 
                  p: 1.5, 
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  borderRadius: 1 
                }}>
                  <Typography variant="body2" color="text.secondary">
                    {notification.details}
                  </Typography>
                </Box>
              </Collapse>
              {notification.details && (
                <Button
                  size="small"
                  onClick={() => setExpanded(!expanded)}
                  sx={{ mt: 1 }}
                  startIcon={expanded ? <CloseIcon fontSize="small" /> : <InfoIcon fontSize="small" />}
                >
                  {expanded ? 'Show Less' : 'Show Details'}
                </Button>
              )}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Tooltip title="Mark as read">
                <IconButton size="small" onClick={() => onDismiss(notification.id)}>
                  <MarkReadIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" onClick={() => onDelete(notification.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const NotificationGroup = ({ date, notifications, onDismiss, onDelete, onToggleSelect, selectedIds }) => {
  const theme = useTheme();
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="subtitle1" 
        sx={{ 
          mb: 2, 
          color: 'text.secondary',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <NotificationsIcon fontSize="small" />
        {formattedDate}
      </Typography>
      <List sx={{ p: 0 }}>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onDismiss={onDismiss}
            onDelete={onDelete}
            onToggleSelect={onToggleSelect}
            isSelected={selectedIds.includes(notification.id)}
          />
        ))}
      </List>
    </Box>
  );
};

const Messages = ({ isGuest }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [alert, setAlert] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkActionAnchor, setBulkActionAnchor] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    push: true,
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'error',
        title: 'Device Fault Detected',
        message: 'Living Room AC is not responding',
        details: 'The device has been unresponsive for the past 15 minutes. Please check the power supply and network connection.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        category: 'device'
      },
      {
        id: 2,
        type: 'warning',
        title: 'High Energy Consumption',
        message: 'Unusual energy spike detected in Kitchen',
        details: 'Energy consumption is 50% higher than usual. Current usage: 2.5kW vs usual 1.2kW at this time.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        category: 'energy'
      },
      {
        id: 3,
        type: 'warning',
        title: 'Security Alert',
        message: 'Motion detected in Living Room while in Away Mode',
        details: 'Motion sensor triggered at 3:42 PM. Last known status: System Armed.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        category: 'security'
      },
      {
        id: 4,
        type: 'info',
        title: 'Device Online',
        message: 'Bedroom Light is back online',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        category: 'device'
      },
    ];
    
    setNotifications(mockNotifications);
  }, []);

  const filteredNotifications = notifications
    .filter(notification => {
      if (filter === 'all') return true;
      return notification.category === filter;
    })
    .filter(notification => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query) ||
        notification.details?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.timestamp - a.timestamp;
      if (sortBy === 'oldest') return a.timestamp - b.timestamp;
      return 0;
    });

  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = new Date(notification.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});

  const handleDismiss = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setAlert({ type: 'success', message: 'Notification marked as read' });
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    setAlert({ type: 'success', message: 'Notification deleted' });
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map(n => n.id));
    }
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'mark-read':
        setNotifications(notifications.map(n => 
          selectedIds.includes(n.id) ? { ...n, read: true } : n
        ));
        setAlert({ type: 'success', message: 'Selected notifications marked as read' });
        break;
      case 'delete':
        setNotifications(notifications.filter(n => !selectedIds.includes(n.id)));
        setAlert({ type: 'success', message: 'Selected notifications deleted' });
        break;
      case 'archive':
        setNotifications(notifications.map(n => 
          selectedIds.includes(n.id) ? { ...n, archived: true } : n
        ));
        setAlert({ type: 'success', message: 'Selected notifications archived' });
        break;
    }
    setSelectedIds([]);
    setBulkActionAnchor(null);
  };

  const handleClearAll = () => {
    setNotifications([]);
    setAlert({ type: 'success', message: 'All notifications cleared' });
  };

  const handleRefresh = () => {
    setAlert({ type: 'success', message: 'Notifications refreshed' });
  };

  const handleCloseAlert = () => {
    setAlert(null);
  };

  const handleNotificationSettingChange = (setting) => (event) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: event.target.checked,
    });
    setAlert({ type: 'success', message: `Notification settings updated` });
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        mb: 3,
        gap: 2
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Notifications
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          flexDirection: { xs: 'row', sm: 'row' },
          width: { xs: '100%', sm: 'auto' }
        }}>
          <Button
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            variant="outlined"
            fullWidth={isMobile}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={handleClearAll}
            disabled={notifications.length === 0}
            color="error"
            fullWidth={isMobile}
          >
            Clear All
          </Button>
        </Box>
      </Box>

      <Card sx={{ mb: 4, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationsIcon color="primary" />
              Notification Settings
            </Typography>
            <ButtonGroup size="small">
              <Button
                startIcon={<CheckBoxIcon />}
                onClick={handleSelectAll}
                disabled={filteredNotifications.length === 0}
              >
                {selectedIds.length === filteredNotifications.length ? 'Deselect All' : 'Select All'}
              </Button>
              {selectedIds.length > 0 && (
                <Button
                  startIcon={<MoreVertIcon />}
                  onClick={(e) => setBulkActionAnchor(e.currentTarget)}
                >
                  Actions
                </Button>
              )}
            </ButtonGroup>
          </Box>
          <Menu
            anchorEl={bulkActionAnchor}
            open={Boolean(bulkActionAnchor)}
            onClose={() => setBulkActionAnchor(null)}
          >
            <MenuItem onClick={() => handleBulkAction('mark-read')}>
              <MarkReadIcon sx={{ mr: 1 }} /> Mark as Read
            </MenuItem>
            <MenuItem onClick={() => handleBulkAction('archive')}>
              <ArchiveIcon sx={{ mr: 1 }} /> Archive
            </MenuItem>
            <MenuItem onClick={() => handleBulkAction('delete')} sx={{ color: 'error.main' }}>
              <DeleteIcon sx={{ mr: 1 }} /> Delete
            </MenuItem>
          </Menu>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3,
            mt: 2
          }}>
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.email}
                  onChange={handleNotificationSettingChange('email')}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ mr: 1 }} />
                  Email Notifications
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.sms}
                  onChange={handleNotificationSettingChange('sms')}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SmsIcon sx={{ mr: 1 }} />
                  SMS Notifications
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.push}
                  onChange={handleNotificationSettingChange('push')}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PushIcon sx={{ mr: 1 }} />
                  Push Notifications
                </Box>
              }
            />
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        mb: 3,
        gap: 2
      }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          width: { xs: '100%', sm: 'auto' }
        }}>
          <TextField
            size="small"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ minWidth: { xs: '100%', sm: 200 } }}
          />
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
            <InputLabel>Filter by</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Filter by"
              startAdornment={<FilterIcon sx={{ mr: 1, color: 'text.secondary' }} />}
            >
              <MenuItem value="all">All Notifications</MenuItem>
              <MenuItem value="device">Device Faults</MenuItem>
              <MenuItem value="energy">Energy Alerts</MenuItem>
              <MenuItem value="security">Security Alerts</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort by"
              startAdornment={<SortIcon sx={{ mr: 1, color: 'text.secondary' }} />}
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {filteredNotifications.length} {filteredNotifications.length === 1 ? 'notification' : 'notifications'} found
        </Typography>
      </Box>

      <AnimatePresence>
        {filteredNotifications.length > 0 ? (
          <Box>
            {Object.entries(groupedNotifications).map(([date, notifications]) => (
              <NotificationGroup
                key={date}
                date={date}
                notifications={notifications}
                onDismiss={handleDismiss}
                onDelete={handleDelete}
                onToggleSelect={(id) => {
                  setSelectedIds(prev => 
                    prev.includes(id) 
                      ? prev.filter(n => n !== id)
                      : [...prev, id]
                  );
                }}
                selectedIds={selectedIds}
              />
            ))}
          </Box>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Card sx={{ 
              p: 4, 
              textAlign: 'center',
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              borderRadius: 2
            }}>
              <NotificationsIcon sx={{ 
                fontSize: 64, 
                color: 'text.secondary', 
                mb: 2,
                opacity: 0.5
              }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No notifications to display
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filter === 'all' 
                  ? 'You\'re all caught up!' 
                  : `No ${filter} notifications found.`}
              </Typography>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Snackbar
        open={!!alert}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={Zoom}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert?.type} 
          variant="filled"
          sx={{ 
            width: '100%',
            backdropFilter: 'blur(8px)',
            '& .MuiAlert-icon': {
              animation: 'pulse 2s infinite',
            },
          }}
        >
          {alert?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Messages;
