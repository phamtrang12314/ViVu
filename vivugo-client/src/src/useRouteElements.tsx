import { useRoutes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomeScreen from "./screens/HomeScreen/HomeScreen";
import TourScreen from "./screens/TourScreen";
import DestinationScreen from "./screens/DestinationScreen";
import AboutScreen from "./screens/AboutScreen";
import ContactScreen from "./screens/ContactScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import TourDetailScreen from "./screens/TourDetailScreen";
import AccountLayout from "./screens/Account/layouts/AccountLayout";
import Profile from "./screens/Account/pages/Profile";
import ChangePassword from "./screens/Account/pages/ChangePassword";
import HistoryTour from "./screens/Account/pages/HistoryTour";
import FavouriteTour from "./screens/Account/pages/FavouriteTour";
import PaymentScreen from "./screens/PaymentScreen/PaymentScreen";

export default function useRouteElements() {
  return useRoutes([
    {
      path: "/",
      index: true,
      element: (
        <MainLayout>
          <HomeScreen />
        </MainLayout>
      ),
    },
    {
      path: "/login",
      element: (
        <MainLayout>
          <LoginScreen />
        </MainLayout>
      ),
    },
    {
      path: "/register",
      element: (
        <MainLayout>
          <RegisterScreen />
        </MainLayout>
      ),
    },
    {
      path: "/forgot-password",
      element: (
        <MainLayout>
          <ForgotPasswordScreen />
        </MainLayout>
      ),
    },
    {
      path: "/tours",
      element: (
        <MainLayout>
          <TourScreen />
        </MainLayout>
      ),
    },
    {
      path: "/tours/:id",
      element: (
        <MainLayout>
          <TourDetailScreen />
        </MainLayout>
      ),
    },
    {
      path: "/payment/:id",
      element: (
        <MainLayout>
          <PaymentScreen />
        </MainLayout>
      ),
    },
    {
      path: "/destinations",
      element: (
        <MainLayout>
          <DestinationScreen />
        </MainLayout>
      ),
    },
    {
      path: "/about",
      element: (
        <MainLayout>
          <AboutScreen />
        </MainLayout>
      ),
    },
    {
      path: "/contact",
      element: (
        <MainLayout>
          <ContactScreen />
        </MainLayout>
      ),
    },
    {
      path: "/account",
      element: (
        <MainLayout>
          <AccountLayout />
        </MainLayout>
      ),
      children: [
        { path: "/account/profile", element: <Profile /> },
        { path: "/account/password", element: <ChangePassword /> },
        { path: "/account/historyTour", element: <HistoryTour /> },
        { path: "/account/favouriteTour", element: <FavouriteTour /> },
      ],
    },
  ]);
}

