import { Navigate, useRoutes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomeScreen from './screens/HomeScreen/HomeScreen'
import TourScreen from './screens/TourScreen'
import DestinationScreen from './screens/DestinationScreen'
import AboutScreen from './screens/AboutScreen'
import ContactScreen from './screens/ContactScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'
import TourDetailScreen from './screens/TourDetailScreen'
import AccountLayout from './screens/Account/layouts/AccountLayout'
import Profile from './screens/Account/pages/Profile'
import ChangePassword from './screens/Account/pages/ChangePassword'
import HistoryTour from './screens/Account/pages/HistoryTour'
import FavouriteTour from './screens/Account/pages/FavouriteTour'
import PaymentScreen from './screens/PaymentScreen/PaymentScreen'
import RefundPolicyScreen from './screens/RefundPolicyScreen'
import TravelGuideArticleScreen from './screens/TravelGuideArticleScreen'

export default function useRouteElements() {
  return useRoutes([
    {
      path: '/',
      index: true,
      element: (
        <MainLayout>
          <HomeScreen />
        </MainLayout>
      )
    },
    {
      path: '/login',
      element: (
        <MainLayout>
          <LoginScreen />
        </MainLayout>
      )
    },
    {
      path: '/register',
      element: (
        <MainLayout>
          <RegisterScreen />
        </MainLayout>
      )
    },
    {
      path: '/forgot-password',
      element: (
        <MainLayout>
          <ForgotPasswordScreen />
        </MainLayout>
      )
    },
    {
      path: '/tours',
      element: (
        <MainLayout>
          <TourScreen />
        </MainLayout>
      )
    },
    {
      path: '/tours/:id',
      element: (
        <MainLayout>
          <TourDetailScreen />
        </MainLayout>
      )
    },
    {
      path: '/payment/:id',
      element: (
        <MainLayout>
          <PaymentScreen />
        </MainLayout>
      )
    },
    {
      path: '/refund-policy',
      element: (
        <MainLayout>
          <RefundPolicyScreen />
        </MainLayout>
      )
    },
    {
      path: '/cam-nang/:slug',
      element: (
        <MainLayout>
          <TravelGuideArticleScreen />
        </MainLayout>
      )
    },
    {
      path: '/destinations',
      element: (
        <MainLayout>
          <DestinationScreen />
        </MainLayout>
      )
    },
    {
      path: '/about',
      element: (
        <MainLayout>
          <AboutScreen />
        </MainLayout>
      )
    },
    {
      path: '/contact',
      element: (
        <MainLayout>
          <ContactScreen />
        </MainLayout>
      )
    },
    {
      path: '/account',
      element: (
        <MainLayout>
          <AccountLayout />
        </MainLayout>
      ),
      children: [
        { index: true, element: <Navigate to="/account/profile" replace /> },
        { path: 'profile', element: <Profile /> },
        { path: 'password', element: <ChangePassword /> },
        { path: 'historyTour', element: <HistoryTour /> },
        { path: 'favouriteTour', element: <FavouriteTour /> }
      ]
    }
  ])
}
