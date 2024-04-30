import React, { useState } from 'react';
import { fireAuth } from '../../config/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSignUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(fireAuth, email, password);
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
      <button onClick={() => handleSignUp(email, password)}>Sign Up</button>
    </div>
  );
};

export default SignupForm;
