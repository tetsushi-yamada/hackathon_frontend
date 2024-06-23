import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import fireAuth from '../../../config/index';
import { postUser, updateUser } from '../../../backend_routes/api/users';
import { useUser } from '../../../contexts/UserContext';
import { Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { ArrowBack } from '../../atoms/Icons/ArrowBackIcon';

// スキーマの定義
const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
  age: yup.number().required('Age is required').min(0, 'Age must be at least 0').integer('Age must be an integer')
});

const SignupForm: React.FC = () => {
  const { setUserId } = useUser();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const [error, setError] = useState<string>('');

  const onSubmit = async (data: { email: string, password: string, username: string, age: number }) => {
    const { email, password, username, age } = data;
    try {
      const userCredential = await createUserWithEmailAndPassword(fireAuth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: username
        });
        const newUserId = userCredential.user.uid;
        await postUser(newUserId, username, age);  // ageをpostUserに渡す
        if (age < 18){
          await updateUser(newUserId, username, age, '', true, true);
        }
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2
      }}>
        <Link to="/auth/signin">
          <ArrowBack />
        </Link>
      </Box>
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Sign Up</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <Controller
            name="username"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                autoComplete="username"
                autoFocus
                error={Boolean(errors.username)}
                helperText={errors.username?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
              />
            )}
          />
          <Controller
            name="age"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="age"
                label="Age"
                type="number"
                autoComplete="age"
                error={Boolean(errors.age)}
                helperText={errors.age?.message}
              />
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
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
