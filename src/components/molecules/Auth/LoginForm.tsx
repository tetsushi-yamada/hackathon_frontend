import React, { useState } from 'react';
import fireAuth from '../../../config/index';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useUser } from '../../../contexts/UserContext';

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
    <div>
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
      <button onClick={() => handleSignIn(email, password)}>Sign In</button>
    </div>
  );
};

export default LoginForm;
