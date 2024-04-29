import React, { useState } from 'react';
import { fireAuth } from '../../config/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  const handleSignIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(fireAuth, email, password);
      console.log(userCredential.user);
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
