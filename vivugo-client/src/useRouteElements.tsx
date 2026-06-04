import { lazy, Suspense, type ReactNode } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

const HomeScreen = lazy(() => import('./screens/HomeScreen/HomeScreen'))
const TourScreen = lazy(() => import('./screens/TourScreen'))
const DestinationScreen = lazy(() => import('./screens/DestinationScreen'))
const AboutScreen = lazy(() => import('./screens/AboutScreen'))
const ContactScreen = lazy(() => import('./screens/ContactScreen'))
const LoginScreen = lazy(() => import('./screens/LoginScreen'))
const RegisterScreen = lazy(() => import('./screens/RegisterScreen'))
const ForgotPasswordScreen = lazy(() => import('./screens/ForgotPasswordScreen'))
const TourDetailScreen = lazy(() => import('./screens/TourDetailScreen'))
const AccountLayout = lazy(() => import('./screens/Account/layouts/AccountLayout'))
const Profile = lazy(() => import('./screens/Account/pages/Profile'))
const ChangePassword = lazy(() => import('./screens/Account/pages/ChangePassword'))
const HistoryTour = lazy(() => import('./screens/Account/pages/HistoryTour'))
const FavouriteTour = lazy(() => import('./screens/Account/pages/FavouriteTour'))
const PaymentScreen = lazy(() => import('./screens/PaymentScreen/PaymentScreen'))
const RefundPolicyScreen = lazy(() => import('./screens/RefundPolicyScreen'))
const TravelGuideArticleScreen = lazy(() => import('./screens/TravelGuideArticleScreen'))

const pageFallback = (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-semibold text-slate-500">
    Đang tải...
  </div>
)

const withPage = (children: ReactNode) => (
  <MainLayout>
    <Suspense fallback={pageFallback}>{children}</Suspense>
  </MainLayout>
)

export default function useRouteElements() {
  return useRoutes([
    {
      path: '/',
      index: true,
      element: withPage(<HomeScreen />)
    },
    {
      path: '/login',
      element: withPage(<LoginScreen />)
    },
    {
      path: '/register',
      element: withPage(<RegisterScreen />)
    },
    {
      path: '/forgot-password',
      element: withPage(<ForgotPasswordScreen />)
    },
    {
      path: '/tours',
      element: withPage(<TourScreen />)
    },
    {
      path: '/tours/:id',
      element: withPage(<TourDetailScreen />)
    },
    {
      path: '/payment/:id',
      element: withPage(<PaymentScreen />)
    },
    {
      path: '/refund-policy',
      element: withPage(<RefundPolicyScreen />)
    },
    {
      path: '/cam-nang/:slug',
      element: withPage(<TravelGuideArticleScreen />)
    },
    {
      path: '/destinations',
      element: withPage(<DestinationScreen />)
    },
    {
      path: '/about',
      element: withPage(<AboutScreen />)
    },
    {
      path: '/contact',
      element: withPage(<ContactScreen />)
    },
    {
      path: '/account',
      element: withPage(<AccountLayout />),
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
