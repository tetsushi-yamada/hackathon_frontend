import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth"; // User型をインポート
import { HomePage } from "./App/(private)/HomePage/HomePage";
import fireAuth from "./config/index";
import { UserProvider } from './contexts/UserContext';
import UserPage from "./App/(private)/UserPage/UserPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SearchPage } from "./App/(private)/SearchPage/Search";
import Auth from "./App/(public)/Auth/page";
import { FollowProvider } from "./contexts/FollowsContext";
import Navbar from "./components/templates/Navbar/navbar";
import SearchAppBar from "./components/molecules/Search/SearchBox";
import { Grid, Paper } from "@mui/material";
import UserSettings from "./components/molecules/Users/Settings";

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
      <FollowProvider>
        {!loginUser && (
          <>
            <Auth />
          </>
        )}
        {loginUser && (
          <>
            <Router>
              <Grid container spacing={2} style={{ marginTop: 16 }}>
                  <Grid item xs={2}>
                    <Navbar />
                  </Grid>
                  <Grid item xs={6}>
                    <Paper style={{ padding: 16, height: '100%' }}>
                      <Routes>
                        <Route path="/userpage" element={<UserPage />} />
                        <Route path="/homepage" element={<HomePage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/settings" element={<UserSettings />} />
                      </Routes>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper style={{ padding: 16, height: '100%' }}>
                      <SearchAppBar />
                    </Paper>
                  </Grid>
              </Grid>
            </Router>
          </>
        )}
      </FollowProvider>
      </UserProvider>
    </>
  );
};

export default App;