import { createTheme, ThemeProvider } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import Coupon from "./Components/Coupon";
import Home from "./Components/Home";
import Loader from "./Components/Loader";
import Login from "./Components/Login";
import Notification from "./Components/Notification";
import ReportParent from "./Components/ReportParent";
import SubscriptionPlans from "./Components/SubscriptionPlans";
import UserDetail from "./Components/UserDetail";
import { auth } from "./config/firebase-config";
import CommonRoute from "./routes/CommonRoute";
import "./styles/style.css";
import colors from "./theme/colors";
import { AuthContext } from "./Context/AuthContext";
const NavigateToCorrectPage = () => {
  if (auth.currentUser) {
    return <Navigate to="/" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <CommonRoute authRequire>
        <Home />
      </CommonRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/notifications",
    element: (
      <CommonRoute authRequire>
        <Notification />
      </CommonRoute>
    ),
  },
  {
    path: "/reports",
    element: (
      <CommonRoute authRequire>
        <ReportParent />
      </CommonRoute>
    ),
  },
  {
    path: "/subscription-plans",
    element: (
      <CommonRoute authRequire>
        <SubscriptionPlans />
      </CommonRoute>
    ),
  },
  {
    path: "/coupons",
    element: (
      <CommonRoute authRequire>
        <Coupon />
      </CommonRoute>
    ),
  },
  {
    path: "/user/:userId",
    element: (
      <CommonRoute authRequire>
        <UserDetail />
      </CommonRoute>
    ),
  },
  {
    path: "*",
    element: <NavigateToCorrectPage />,
  },
]);
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
  // if (isLoading) {
  //   return <Loader />;
  // }
  return (
    <ThemeProvider theme={theme}>
      <AuthContext>
        <RouterProvider router={router} />
      </AuthContext>
    </ThemeProvider>
  );
};
export default App;
