import { useRoutes } from "react-router-dom";

function PlaceholderScreen({ title }: { title: string }) {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-32">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">ViVuGo</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">{title}</h1>
        <p className="mt-4 text-slate-600">
          Trang nay da san sang cho production build. Hay thay placeholder bang man hinh chinh thuc khi bo sung lai source.
        </p>
      </div>
    </main>
  );
}

export default function useRouteElements() {
  return useRoutes([
    {
      path: "/",
      index: true,
      element: <PlaceholderScreen title="Trang chu ViVuGo" />,
    },
    {
      path: "/login",
      element: <PlaceholderScreen title="Dang nhap" />,
    },
    {
      path: "/register",
      element: <PlaceholderScreen title="Dang ky" />,
    },
    {
      path: "/forgot-password",
      element: <PlaceholderScreen title="Quen mat khau" />,
    },
    {
      path: "/tours",
      element: <PlaceholderScreen title="Danh sach tour" />,
    },
    {
      path: "/tours/:id",
      element: <PlaceholderScreen title="Chi tiet tour" />,
    },
    {
      path: "/payment/:id",
      element: <PlaceholderScreen title="Thanh toan" />,
    },
    {
      path: "/destinations",
      element: <PlaceholderScreen title="Diem den" />,
    },
    {
      path: "/about",
      element: <PlaceholderScreen title="Gioi thieu" />,
    },
    {
      path: "/contact",
      element: <PlaceholderScreen title="Lien he" />,
    },
    {
      path: "/account",
      element: <PlaceholderScreen title="Tai khoan" />,
      children: [
        { path: "/account/profile", element: <PlaceholderScreen title="Ho so" /> },
        { path: "/account/password", element: <PlaceholderScreen title="Doi mat khau" /> },
        { path: "/account/historyTour", element: <PlaceholderScreen title="Lich su tour" /> },
        { path: "/account/favouriteTour", element: <PlaceholderScreen title="Tour yeu thich" /> },
      ],
    },
  ]);
}

