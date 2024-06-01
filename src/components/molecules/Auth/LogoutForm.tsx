import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import NormalButton from '../../atoms/Buttons/NormalButton';

const LogoutForm: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut(auth);
      alert("ログアウトしました。");
      navigate("/auth/signin");
    } catch (error) {
      if (error instanceof Error) {
        console.error("ログアウトに失敗しました：", error.message);
      }
    }
  };

  return (
    <NormalButton onClick={handleLogout} color="red">ログアウト</NormalButton>
  );
};

const LogoutFunction = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
    alert("ログアウトしました。");
  } catch (error) {
    if (error instanceof Error) {
      console.error("ログアウトに失敗しました：", error.message);
    }
  }
}

export default LogoutForm;
export { LogoutFunction };