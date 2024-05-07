import LoginForm from "./components/Auth/LoginForm";
import SignupForm from "./components/Auth/SignupForm";
import ResetPasswordForm from "./components/Auth/PasswordResetForm";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth"; // User型をインポート
import { HomePage } from "./components/HomePage/contents";
import { fireAuth } from "./config/firebaseConfig";
import { UserProvider } from './contexts/UserContext';
import { TweetProvider } from "./contexts/TweetContext";
import UserPageComponent from "./components/UserPage/UserPage";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { SearchPage } from "./components/SearchPage/Search";

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
            <Router>
              <Routes>
                <Route path="/userpage" element={<UserPageComponent />} />
                <Route path="/homepage" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
              </Routes>
              <Link to="/homepage"><button>Home Page</button></Link>
              <Link to="/userpage"><button>User Page</button></Link>
              <Link to="/search"><button>Search Page</button></Link>
            </Router>
          </>
        )}
      </TweetProvider>
      </UserProvider>
    </>
  );
};

export default App;
