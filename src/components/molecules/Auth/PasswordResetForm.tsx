import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import fireAuth from '../../../config/index';

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
    <div>
      <h2>パスワードリセット</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレスを入力"
          required
        />
        <button type="submit">リセットリンクを送信</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ResetPasswordForm;
