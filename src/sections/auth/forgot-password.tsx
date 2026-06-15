import { useState } from 'react';

import {
  Card,
  Alert,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';

export default function ForgotPasswordView() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setSuccess(false);

    // Required Validation
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    // Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');

    try {
      setLoading(true);

      // API Call
      // await axios.post('/api/v1/admin/auth/forgot-password', {
      //   email,
      // });

      setSuccess(true);
      setEmail('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        p: 4,
        maxWidth: 450,
        mx: 'auto',
        mt: 10,
      }}
    >
      <Typography variant="h5" mb={1}>
        Forgot Password
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        mb={3}
      >
        Enter your registered email address.
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Password reset link sent successfully.
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email Address"
        value={email}
        error={!!emailError}
        helperText={emailError}
        onChange={(e) => {
          setEmail(e.target.value);

          if (emailError) {
            setEmailError('');
          }
        }}
        sx={{ mb: 3 }}
      />

      <Button
        fullWidth
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
        startIcon={
          loading ? (
            <CircularProgress
              size={18}
              color="inherit"
            />
          ) : null
        }
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </Button>
    </Card>
  );
}