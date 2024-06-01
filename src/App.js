import { createTheme, ThemeProvider } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./Components/Home";
import Loader from "./Components/Loader";
import Login from "./Components/Login";
import { auth } from "./config/firebase-config";
import CommonRoute from "./routes/CommonRoute";
import colors from "./theme/colors";
import "./styles/style.css";
import UserDetail from "./Components/UserDetail";
import Coupon from "./Components/Coupon";
import Report from "./Components/Report";
import Notification from "./Components/Notification";
import ReportParent from "./Components/ReportParent";
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const theme = createTheme({
    typography: {
      button: {
        textTransform: "none",
      },
      fontFamily: ["Times New Roman"].join(","),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ ownerState }) => ({
            "&:hover": {
              backgroundColor:
                ownerState.variant == "contained" && colors.appPrimary,
            },
          }),
        },
      },
    },
  });
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setIsLoading(false);
        navigate("/");
      } else {
        setIsLoading(false);
        navigate("/login");
      }
    });
    return unsubscribe;
  }, []);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route
          exact
          element={
            <CommonRoute>
              <Login />
            </CommonRoute>
          }
          path="/login"
        />
        <Route
          exact
          element={
            <CommonRoute authRequire>
              <Home />
            </CommonRoute>
          }
          path="/"
        />
        {/* <Route exact element={<CommonRoute authRequire><Home /></CommonRoute>} path='/user' /> */}
        <Route
          exact
          element={
            <CommonRoute authRequire>
              <Notification />
            </CommonRoute>
          }
          path="/notifications"
        />
        <Route
          exact
          element={
            <CommonRoute authRequire>
              <ReportParent />
            </CommonRoute>
          }
          path="/reports"
        />

        <Route
          exact
          element={
            <CommonRoute authRequire>
              <Coupon />
            </CommonRoute>
          }
          path="/coupons"
        />

        <Route
          exact
          element={
            <CommonRoute authRequire>
              <UserDetail />
            </CommonRoute>
          }
          path="/user/:userId"
        />
        <Route path="*" element={<NavigateToCorrectPage />} />
      </Routes>
    </ThemeProvider>
  );
};
export default App;

const NavigateToCorrectPage = () => {
  if (auth.currentUser) {
    return <Navigate to="/" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};
