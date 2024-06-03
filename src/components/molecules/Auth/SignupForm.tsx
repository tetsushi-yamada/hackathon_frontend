import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import fireAuth from '../../../config/index';
import { postUser } from '../../../backend_routes/api/users';
import { useUser } from '../../../contexts/UserContext';
import { Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { ArrowBack } from '../../atoms/Icons/ArrowBackIcon';


const SignupForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { setUserId } = useUser();

  const handleSignUp = async (email: string, password: string, username: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(fireAuth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: username
        });
        const newUserId = userCredential.user.uid;
        await postUser(newUserId, username);
        setUserId(newUserId);
        console.log('Created user ID:', newUserId);
      }
    } catch (error: any) {
      setError(error.message);
      console.error(error.message);
      setUserId('');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Link to="/auth/signin">
          <ArrowBack />
        </Link>
      </Box>
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Sign Up</Typography>
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password(more than 6 letters)"
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
            onClick={() => handleSignUp(email, password, username)}
          >
            Sign Up
          </Button>
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </Box>
    </Container>
  );
};

export default SignupForm;
