import React from 'react';
import { getAuth, signOut } from 'firebase/auth';

const LogoutForm: React.FC = () => {
  const auth = getAuth();

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut(auth);
      alert("ログアウトしました。");
    } catch (error) {
      if (error instanceof Error) {
        console.error("ログアウトに失敗しました：", error.message);
      }
    }
  };

  return (
    <button onClick={handleLogout}>ログアウト</button>
  );
};

export default LogoutForm;
