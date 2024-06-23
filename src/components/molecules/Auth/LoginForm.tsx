import React, { useState } from 'react';
import fireAuth from '../../../config/index';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useUser } from '../../../contexts/UserContext';
import { Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { ArrowBack } from '../../atoms/Icons/ArrowBackIcon';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { setUserId } = useUser();
  
  const handleSignIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(fireAuth, email, password);
      console.log(userCredential.user);
      if (userCredential.user) {
        setUserId(userCredential.user.uid);
        console.log('Signed in user ID:', userCredential.user.uid);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <Container
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(to bottom, #2193b0, #6dd5ed)', // 青色のグラデーション
      padding: 2,
      boxShadow: 3,
      borderRadius: 2,
  }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Link to="/auth/signin">
          <ArrowBack />
        </Link>
      </Box>
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Sign In</Typography>
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => handleSignIn(email, password)}
          >
            Sign In
          </Button>
          <Link to="/pass-reset">
            {"Forgot password?"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm;
