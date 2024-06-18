import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { HomePage } from "./App/(private)/HomePage/HomePage";
import fireAuth from "./config/index";
import { UserProvider } from './contexts/UserContext';
import UserPage from "./App/(private)/UserPage/UserPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SearchPage } from "./App/(private)/SearchPage/Search";
import Navbar from "./components/templates/Navbar/navbar";
import SearchAppBar from "./components/atoms/Search/SearchBox";
import { Grid, Paper, useMediaQuery } from "@mui/material";
import UserSettingsPage from "./App/(private)/UserPage/UserSettings/UserSeetings";
import LoginPage from "./App/(public)/SigninPage/Signin";
import SignUpPage from "./App/(public)/SignupPage/Signup";
import PassWordResetPage from "./App/(public)/PassWordResetPage/PassWordReset";
import AuthSelection from "./components/templates/AuthForm/AuthSelection";
import { ProfileSettingsPage } from "./App/(private)/UserPage/UserSettings/UserProfileSettings/ProfileSettings";
import OtherUserPageComponent from "./components/organisms/OtherUserPage";
import { FollowRequestsPage } from "./App/(private)/UserPage/UserFollowRequests/FollowRequests";

const App = () => {
  const auth = getAuth();
  const [loginUser, setLoginUser] = useState<User | null>(null);

  const isWideScreen = useMediaQuery('(min-width:1215px)');
  const isSmallScreen = useMediaQuery('(max-width:640px)');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fireAuth, user => {
      setLoginUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  return (
    <>
      <UserProvider>
        {!loginUser && (
          <>
            <Router>
              <Routes>
                <Route path="/auth/signin" element={<AuthSelection />} />
                <Route path="/signin" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/pass-reset" element={<PassWordResetPage />} />
                <Route path="*" element={<Navigate to="/auth/signin" />} /> 
              </Routes>
            </Router>
          </>
        )}
        {loginUser && (
          <>
            <Router>
              <Grid container spacing={2} style={{ marginTop: 16 }}>
                  <Grid item xs={isSmallScreen ? 12 : 2}>
                    <Navbar />
                  </Grid>
                  <Grid item xs={isWideScreen ? 6 : isSmallScreen ? 12 : 10} style={{ marginTop: isSmallScreen ? '60px' : '0' }}>
                    <Paper style={{ padding: 16, height: '100%' }}>
                      <Routes>
                        <Route path="/userpage" element={<UserPage />} />
                        <Route path="/homepage" element={<HomePage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/userpage/follow-requests" element={<FollowRequestsPage />} />
                        <Route path="/userpage/settings" element={<UserSettingsPage />} />
                        <Route path="/userpage/settings/profile" element={<ProfileSettingsPage />} />
                        <Route path="/userpage/:userId" element={<OtherUserPageComponent />} />
                        <Route path="*" element={<Navigate to="/homepage" />} /> 
                      </Routes>
                    </Paper>
                  </Grid>
                  {isWideScreen && (
                    <Grid item xs={4}>
                      <Paper style={{ padding: 16, height: '100%' }}>
                        <SearchAppBar />
                      </Paper>
                    </Grid>
                  )}
              </Grid>
            </Router>
          </>
        )}
      </UserProvider>
    </>
  );
};

export default App;
