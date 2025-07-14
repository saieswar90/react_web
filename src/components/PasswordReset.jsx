import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert,
  IconButton,
  InputAdornment,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  styled 
} from '@mui/material/styles';
import { 
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { auth } from '../firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';

const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
    : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
  position: 'relative',
  overflow: 'hidden',
}));

const BackgroundPattern = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: theme.palette.mode === 'dark' 
    ? 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
    : 'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%)',
  opacity: 0.1,
  pointerEvents: 'none',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 400,
  borderRadius: 24,
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backdropFilter: 'blur(10px)',
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(26, 26, 26, 0.9)'
    : 'rgba(255, 255, 255, 0.9)',
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 12px 48px rgba(0, 0, 0, 0.4)'
      : '0 12px 48px rgba(0, 0, 0, 0.2)',
  },
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    transition: 'all 0.3s ease',
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.02)',
    '& fieldset': {
      borderColor: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.12)',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.7)'
      : 'rgba(0, 0, 0, 0.7)',
  },
  '& .MuiInputBase-input': {
    padding: '16px 14px',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  height: 56,
  borderRadius: 16,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 24px rgba(0, 0, 0, 0.3)'
      : '0 8px 24px rgba(0, 0, 0, 0.15)',
  },
}));

const PasswordReset = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setError('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer>
      <BackgroundPattern />
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          width: '100%',
          maxWidth: '400px',
          mx: 'auto',
        }}
      >
    <StyledPaper>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                width: '100%',
              }}
            >
              <Box
                component={motion.div}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2
                }}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 32px rgba(144, 202, 249, 0.3)'
                    : '0 8px 32px rgba(144, 202, 249, 0.2)',
                }}
              >
                <SendIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>

              <Typography 
                variant="h4" 
                component="h1" 
                color="primary" 
                textAlign="center"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
          Reset Password
        </Typography>

              <Typography 
                variant="body1" 
                color="text.secondary" 
                textAlign="center"
                sx={{ mb: 2 }}
              >
                Enter your email address and we'll send you a link to reset your password
              </Typography>

        {error && (
                <Alert 
                  severity="error" 
                  sx={{
                    width: '100%',
                    borderRadius: 2,
                    mb: 2,
                    boxShadow: 2,
                  }}
                >
            {error}
          </Alert>
        )}

        {success && (
                <Alert 
                  severity="success" 
                  sx={{
                    width: '100%',
                    borderRadius: 2,
                    mb: 2,
                    boxShadow: 2,
                  }}
                >
            Password reset email sent! Please check your inbox.
          </Alert>
        )}

              <Box 
                component="form" 
                onSubmit={handleReset} 
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
          <StyledTextField
            fullWidth
            label="Email Address"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            error={error && error.includes('email')}
            helperText={error && error.includes('email') ? error : ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
          />

          <StyledButton
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
                  sx={{ mt: 2 }}
          >
            {loading ? (
                    <Box 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center"
                      gap={1}
                    >
                      <CircularProgress 
                        size={20} 
                        sx={{
                          color: theme.palette.primary.contrastText,
                        }}
                      />
                      <Typography 
                        variant="body1" 
                        sx={{
                          color: theme.palette.primary.contrastText,
                          fontWeight: 600,
                        }}
                      >
                        Sending Reset Link...
                </Typography>
              </Box>
            ) : (
                    <Box 
                      display="flex" 
                      alignItems="center" 
                      gap={1}
                    >
                      <SendIcon 
                        sx={{
                          fontSize: 20,
                          color: theme.palette.primary.contrastText,
                        }}
                      />
                      Send Reset Link
                    </Box>
            )}
          </StyledButton>

          <Button
            fullWidth
            variant="text"
            color="primary"
            onClick={onBack}
                  sx={{
                    mt: 1,
                    height: 40,
                    borderRadius: 2,
                    textTransform: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(45deg, rgba(144, 202, 249, 0.1) 0%, rgba(144, 202, 249, 0.05) 100%)'
                        : 'linear-gradient(45deg, rgba(144, 202, 249, 0.05) 0%, rgba(144, 202, 249, 0.02) 100%)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover::before': {
                      opacity: 1,
                    },
                    '&:hover': {
                      backgroundColor: 'transparent',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: theme.palette.primary.main,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: theme.palette.primary.dark,
                      },
                    }}
                  >
                    <ArrowBackIcon 
                      sx={{ 
                        fontSize: 18,
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateX(-4px)',
                        },
                      }} 
                    />
                    <Typography
                      sx={{
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        letterSpacing: '0.02em',
                      }}
          >
            Back to Login
                    </Typography>
                  </Box>
          </Button>
              </Box>
        </Box>
      </Box>
    </StyledPaper>
      </Box>
    </StyledContainer>
  );
};

export default PasswordReset;
