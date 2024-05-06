import LoginForm from "./components/Auth/LoginForm";
import SignupForm from "./components/Auth/SignupForm";
import ResetPasswordForm from "./components/Auth/PasswordResetForm";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth"; // User型をインポート
import { HomePage } from "./components/HomePage/contents";
import { fireAuth } from "./config/firebaseConfig";
import LogoutForm from "./components/Auth/LogoutForm";
import { UserProvider } from './contexts/UserContext';
import { TweetProvider } from "./contexts/TweetContext";

const App = () => {
  const auth = getAuth();
  const [loginUser, setLoginUser] = useState<User | null>(null); // loginUserの型をUser | nullに設定

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fireAuth, user => {
      setLoginUser(user); // userはUser型またはnull
    });
    return () => unsubscribe(); // コンポーネントのアンマウント時にリスナーを解除
  }, [auth]);

  return (
    <>
      <UserProvider>
      <TweetProvider>
        {!loginUser && (
          <>
            <LoginForm />
            <SignupForm />
            <ResetPasswordForm />
          </>
        )}
        {loginUser && (
          <>
            <HomePage />
            <LogoutForm />
          </>
        )}
      </TweetProvider>
      </UserProvider>
    </>
  );
};

export default App;
