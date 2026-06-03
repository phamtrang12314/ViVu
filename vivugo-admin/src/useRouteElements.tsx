import { Navigate, useRoutes } from "react-router-dom";
import { useContext } from "react";
import AdminScreen from "./screens/AdminScreen";
import AdminLoginScreen from "./screens/AdminLoginScreen";
import { AppContext } from "./contexts/app.context";
import FormTourScreen from "./admin/screens/ManageTour/FormTourScreen";
import TourDetailAdminScreen from "./admin/screens/ManageTour/TourDetailAdminScreen";
import ManageDestinationScreen from "./admin/screens/ManageDestination/ManageDestinationScreen";
import FormDestinationScreen from "./admin/screens/ManageDestination/FormDestinationScreen";
import DestinationDetailScreen from "./admin/screens/ManageDestination/DestinationDetailAdminScreen";
import DashboardScreen from "./admin/screens/DashboardScreen";
import RevenueReportScreen from "./admin/screens/RevenueScreen/RevenueReportScreen";
import ManageTourScreen from "./admin/screens/ManageTour/ManageTourScreen";
import ManagePromotionScreen from "./admin/screens/PromotionScreen/ManagePromotionScreen";
import PromotionDetailScreen from "./admin/screens/PromotionScreen/PromotionDetailScreen";
import UserAdminScreen from "./admin/screens/ManageUserScreen/ManageUserScreen";
import ContactMessageScreen from "./admin/screens/ContactMessageScreen/ContactMessageScreen";
import ManageReviewScreen from "./admin/screens/ReviewScreen/ManageReviewScreen";
import ManageTourTypeScreen from "./admin/screens/ManageTourType/ManageTourTypeScreen";
import FormTourTypeScreen from "./admin/screens/ManageTourType/FormTourTypeScreen";
import TourTypeDetailAdminScreen from "./admin/screens/ManageTourType/TourTypeDetailAdminScreen";
import ManageBookingScreen from "./admin/screens/ManageBookingScreen/ManageBookingScreen";
import BookingDetailAdminScreen from "./admin/screens/ManageBookingScreen/BookingDetailAdminScreen";
import TourParticipantsScreen from "./admin/screens/ManageBookingScreen/TourParticipantsScreen";
import CanceledBookingsScreen from "./admin/screens/ManageBookingScreen/CanceledBookingsScreen";

const adminChildren = [
  { path: "dashboard", element: <DashboardScreen /> },
  { path: "revenue", element: <RevenueReportScreen /> },
  { path: "manage-tour", element: <ManageTourScreen /> },
  { path: "tours/new", element: <FormTourScreen /> },
  { path: "tours/:id/edit", element: <FormTourScreen /> },
  { path: "tours/details/:id", element: <TourDetailAdminScreen /> },
  { path: "manage-destination", element: <ManageDestinationScreen /> },
  { path: "manage-destination/:id/edit", element: <FormDestinationScreen /> },
  { path: "manage-destination/new", element: <FormDestinationScreen /> },
  { path: "manage-destination/detail/:id", element: <DestinationDetailScreen /> },
  { path: "promotions", element: <ManagePromotionScreen /> },
  { path: "promotions/detail/:id", element: <PromotionDetailScreen /> },
  { path: "users", element: <UserAdminScreen /> },
  { path: "contact-messages", element: <ContactMessageScreen /> },
  { path: "reviews", element: <ManageReviewScreen /> },
  { path: "tour-types", element: <ManageTourTypeScreen /> },
  { path: "tour-types/new", element: <FormTourTypeScreen /> },
  { path: "tour-types/:id/edit", element: <FormTourTypeScreen /> },
  { path: "tour-types/detail/:id", element: <TourTypeDetailAdminScreen /> },
  { path: "manage-booking", element: <ManageBookingScreen /> },
  { path: "manage-booking/detail/:id", element: <BookingDetailAdminScreen /> },
  { path: "manage-booking/tour-participants", element: <TourParticipantsScreen /> },
  { path: "manage-booking/canceled", element: <CanceledBookingsScreen /> },
];

export default function useRouteElements() {
  const { isAuthenticated } = useContext(AppContext);

  return useRoutes([
    { path: "/", element: <Navigate to={isAuthenticated ? "/admin/dashboard" : "/login"} replace /> },
    { path: "/login", element: <AdminLoginScreen /> },
    {
      path: "/admin",
      element: isAuthenticated ? <AdminScreen /> : <Navigate to="/login" replace />,
      children: adminChildren,
    },
  ]);
}

