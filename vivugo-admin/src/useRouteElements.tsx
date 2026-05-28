import { Navigate, useRoutes } from "react-router-dom";
import { useContext } from "react";
import AdminScreen from "./screens/AdminScreen";
import AdminLoginScreen from "./screens/AdminLoginScreen";
import { AppContext } from "./contexts/app.context";

function AdminPlaceholder({ title }: { title: string }) {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <section className="rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">ViVuGo Admin</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">{title}</h1>
        <p className="mt-4 text-slate-600">
          Trang admin nay da san sang cho production build. Hay thay placeholder bang man hinh chinh thuc khi bo sung lai source.
        </p>
      </section>
    </main>
  );
}

const adminChildren = [
  { path: "dashboard", element: <AdminPlaceholder title="Dashboard" /> },
  { path: "manage-tour", element: <AdminPlaceholder title="Quan ly tour" /> },
  { path: "tours/new", element: <AdminPlaceholder title="Them tour" /> },
  { path: "tours/:id/edit", element: <AdminPlaceholder title="Sua tour" /> },
  { path: "tours/details/:id", element: <AdminPlaceholder title="Chi tiet tour" /> },
  { path: "manage-destination", element: <AdminPlaceholder title="Quan ly diem den" /> },
  { path: "manage-destination/:id/edit", element: <AdminPlaceholder title="Sua diem den" /> },
  { path: "manage-destination/new", element: <AdminPlaceholder title="Them diem den" /> },
  { path: "manage-destination/detail/:id", element: <AdminPlaceholder title="Chi tiet diem den" /> },
  { path: "promotions", element: <AdminPlaceholder title="Khuyen mai" /> },
  { path: "users", element: <AdminPlaceholder title="Nguoi dung" /> },
  { path: "contact-messages", element: <AdminPlaceholder title="Tin nhan lien he" /> },
  { path: "reviews", element: <AdminPlaceholder title="Danh gia" /> },
  { path: "tour-types", element: <AdminPlaceholder title="Loai tour" /> },
  { path: "tour-types/new", element: <AdminPlaceholder title="Them loai tour" /> },
  { path: "tour-types/:id/edit", element: <AdminPlaceholder title="Sua loai tour" /> },
  { path: "tour-types/detail/:id", element: <AdminPlaceholder title="Chi tiet loai tour" /> },
  { path: "manage-booking", element: <AdminPlaceholder title="Quan ly booking" /> },
  { path: "manage-booking/detail/:id", element: <AdminPlaceholder title="Chi tiet booking" /> },
  { path: "manage-booking/tour-participants", element: <AdminPlaceholder title="Nguoi tham gia tour" /> },
  { path: "manage-booking/canceled", element: <AdminPlaceholder title="Booking da huy" /> },
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

