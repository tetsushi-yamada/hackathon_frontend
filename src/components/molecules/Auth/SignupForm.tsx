import { useUser } from '../../../contexts/UserContext';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import fireAuth from '../../../config/index';
import { postUser } from '../../../backend_routes/api/users';

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
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={() => handleSignUp(email, password, username)}>Sign Up</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default SignupForm;
