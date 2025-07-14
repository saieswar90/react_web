import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  styled,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  LockOutlined as LockIcon,
  Email as EmailIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';

const db = getFirestore();

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.palette.mode === 'dark'
    ? '#121212'
    : '#e0f7fa',
  position: 'relative',
  overflow: 'hidden',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 400,
  borderRadius: 24,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: '16px auto',
  background: theme.palette.primary.main,
  width: 80,
  height: 80,
  fontSize: 40,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  height: 50,
  borderRadius: 12,
  fontWeight: 'bold',
  textTransform: 'none',
}));
// ... imports remain the same ...

const Login = ({ onLogin }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const q = query(collection(db, "Users"), where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("User not found in Firestore.");
        setLoading(false);
        return;
      }

      const userData = querySnapshot.docs[0].data();
      const deviceId = userData.deviceId?.[0] || '';
      const originalHomeId = userData.originalHomeId || '';
      const updateHomeId = userData.updateHomeId || '';
      const username = userData.username || user.email;

      if (!deviceId) {
        setError("No deviceId associated with your account.");
        setLoading(false);
        return;
      }

      // Save to localStorage
      localStorage.setItem("username", username);
      localStorage.setItem("deviceId", deviceId);
      localStorage.setItem("originalHomeId", originalHomeId);
      localStorage.setItem("updateHomeId", updateHomeId);

      const payload = { deviceId, originalHomeId, updateHomeId };

      // ✅ POST to both servers
      const responses = await Promise.allSettled([
        fetch("https://app-web-backend-5dd0.onrender.com/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }),
        fetch("https://b413c80f8584.ngrok-free.app/data1", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
      ]);

      responses.forEach((res, idx) => {
        const label = idx === 0 ? 'ngrok' : 'cloudflare';
        if (res.status === 'fulfilled') {
          console.log(`${label} server responded successfully.`);
        } else {
          console.warn(`${label} server failed:`, res.reason);
        }
      });

      onLogin(); // proceed to dashboard or next page

    } catch (err) {
      console.error("Login Error:", err);
      setError("Login failed. " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer>
      <CssBaseline />
      <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <StyledPaper elevation={4}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <StyledAvatar><LockIcon /></StyledAvatar>
            <Typography component="h1" variant="h5">Sign in</Typography>
            {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
              <StyledTextField
                label="Email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  )
                }}
              />
              <StyledTextField
                label="Password"
                fullWidth
                margin="normal"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
              </StyledButton>
            </Box>
          </Box>
        </StyledPaper>
      </Box>
    </StyledContainer>
  );
};

export default Login;
