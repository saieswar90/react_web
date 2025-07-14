import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import DevicesIcon from '@mui/icons-material/Devices';
import TvIcon from '@mui/icons-material/Tv';
import PrintIcon from '@mui/icons-material/Print';
import SpeakerIcon from '@mui/icons-material/Speaker';
import ComputerIcon from '@mui/icons-material/Computer';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';

// Helper to pick icon based on service type
const getDeviceIcon = (type) => {
    if (!type) return <DevicesIcon color="primary" />;
    if (type.includes('airplay')) return <TvIcon color="secondary" />;
    if (type.includes('ipp') || type.includes('printer')) return <PrintIcon color="action" />;
    if (type.includes('googlecast')) return <TvIcon color="primary" />;
    if (type.includes('workstation')) return <ComputerIcon color="action" />;
    if (type.includes('speaker') || type.includes('raop')) return <SpeakerIcon color="success" />;
    return <DevicesIcon color="primary" />;
};

export default function DeviceDiscoveryDialog({ open, onDone }) {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [checked, setChecked] = useState([]);

    const scanDevices = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:5000/api/discover');
            if (response.data.success) {
                const discoveredDevices = response.data.devices.map((device, index) => ({
                    id: `dev-${index}`,
                    name: device.name,
                    type: device.service,
                    ip: device.ip,
                    port: device.port
                }));
                setDevices(discoveredDevices);
                setChecked(discoveredDevices.map(d => d.id));
            } else {
                setError('Failed to discover devices');
            }
        } catch (err) {
            setError(err.message || 'Failed to connect to the server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            scanDevices();
        }
    }, [open]);

    const handleToggle = (id) => () => {
        setChecked((prev) =>
            prev.includes(id)
                ? prev.filter((c) => c !== id)
                : [...prev, id]
        );
    };

    const handleDiscover = () => {
        const selected = devices.filter(d => checked.includes(d.id));
        onDone(selected);
    };

    return (
        <Dialog 
            open={open} 
            disableEscapeKeyDown
            maxWidth="sm"
            fullWidth
            PaperProps={{
                style: { borderRadius: 16, background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', color: '#fff' }
            }}
        >
            <DialogTitle sx={{ fontWeight: 700, fontSize: 24, letterSpacing: 1, color: '#fff', pb: 1 }}>
                Network Device Discovery
            </DialogTitle>
            <DialogContent dividers sx={{ minHeight: 280, background: 'rgba(30,30,30,0.95)' }}>
                {loading ? (
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={6}>
                        <CircularProgress color="primary" size={48} sx={{ mb: 2 }} />
                        <Typography variant="h6" color="#fff" sx={{ mt: 2 }}>
                            Scanning your network for devices...
                        </Typography>
                        <Typography variant="body2" color="#bbb" sx={{ mt: 1 }}>
                            This may take a few seconds.
                        </Typography>
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ mb: 4 }}>
                        {error}
                    </Alert>
                ) : devices.length === 0 ? (
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={6}>
                        <HelpOutlineIcon sx={{ fontSize: 64, color: '#90caf9', mb: 2 }} />
                        <Typography variant="h6" color="#fff">
                            No devices discovered.
                        </Typography>
                        <Typography variant="body2" color="#bbb" sx={{ mt: 1 }}>
                            Please make sure your devices are powered on and connected to the same Wi-Fi network.<br />
                            You can try scanning again or skip this step.
                        </Typography>
                    </Box>
                ) : (
                    <List>
                        {devices.map((device) => (
                            <ListItem 
                                key={device.id} 
                                button 
                                onClick={handleToggle(device.id)}
                                sx={{
                                    borderRadius: 2,
                                    mb: 1,
                                    background: checked.includes(device.id) ? 'rgba(144,202,249,0.12)' : 'transparent',
                                    transition: 'background 0.2s',
                                    '&:hover': { background: 'rgba(144,202,249,0.18)' },
                                    py: 1.5
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <Checkbox
                                        edge="start"
                                        checked={checked.includes(device.id)}
                                        tabIndex={-1}
                                        disableRipple
                                        sx={{ color: '#90caf9' }}
                                    />
                                </ListItemIcon>
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    {getDeviceIcon(device.type)}
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography sx={{ color: '#fff', fontWeight: 500 }}>{device.name}</Typography>}
                                    secondary={
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography variant="caption" color="#90caf9">
                                                Service: {device.type}
                                            </Typography>
                                            <Typography variant="caption" color="#bbb" sx={{ mt: 0.5 }}>
                                                IP: {device.ip || 'N/A'}
                                            </Typography>
                                            {device.port && (
                                                <Typography variant="caption" color="#bbb" sx={{ mt: 0.5 }}>
                                                    Port: {device.port}
                                                </Typography>
                                            )}
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </DialogContent>
            <DialogActions sx={{ background: 'rgba(30,30,30,0.95)', p: 2 }}>
                <Button 
                    onClick={() => onDone([])}
                    color="secondary"
                    variant="outlined"
                    sx={{ borderRadius: 8, fontWeight: 600, mr: 1 }}
                >
                    Skip
                </Button>
                <Button 
                    onClick={scanDevices} 
                    disabled={loading}
                    color="primary"
                    variant="outlined"
                    sx={{ borderRadius: 8, fontWeight: 600, mr: 1 }}
                >
                    Scan Again
                </Button>
                <Button 
                    variant="contained" 
                    onClick={handleDiscover} 
                    color="primary"
                    disabled={loading || devices.length === 0}
                    sx={{ borderRadius: 8, fontWeight: 600 }}
                >
                    Add Selected Devices
                </Button>
            </DialogActions>
        </Dialog>
    );
}
