import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import fireAuth from '../../../config/index';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const ResetPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await sendPasswordResetEmail(fireAuth, email);
      setMessage('パスワードリセットのリンクをメールで送信しました。');
      setError('');
    } catch (err: any) {
      setError('パスワードリセットのリンクを送信できませんでした。');
      setMessage('');
      console.error('Password reset error', err);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">パスワードリセット</Typography>
        <Box component="form" onSubmit={handleResetPassword} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="メールアドレスを入力"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            リセットリンクを送信
          </Button>
        </Box>
        {message && <Typography color="success">{message}</Typography>}
        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </Container>
  );
};

export default ResetPasswordForm;
