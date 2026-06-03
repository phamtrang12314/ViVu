import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../../apis/auth.api";
import UserImage from "../../../assets/user.png";
import { NavLink, Outlet } from "react-router-dom";

export default function AccountDetail() {
  const { data: userData } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return getProfile();
    },
  });

  console.log(userData);

  return (
    <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-blue-600 text-white rounded-t-2xl p-8 flex items-center">
        <div className="w-24 h-24 rounded-full text-blue-600 flex items-center justify-center text-5xl font-semibold">
          <img
            src={UserImage}
            alt=""
            className="w-20 h-20 cursor-pointer object-cover"
          />
        </div>
        <div className="ml-10">
          <h2 className="text-2xl font-bold mt-4">{userData?.data.name}</h2>
          <p className="text-sm mt-2">{userData?.data.email}</p>
          <p className="text-sm mt-2">{userData?.data.phoneNumber}</p>
        </div>
      </div>

      <div className="border-b flex justify-center space-x-8 text-sm font-medium">
        <NavLink
          to="/account/profile"
          className={({ isActive }) =>
            isActive
              ? "py-3 px-4 border-b-2 border-blue-600 text-blue-600"
              : "py-3 px-4 hover:text-[#2663ec]"
          }
        >
          Thông tin cá nhân
        </NavLink>
        <NavLink
          to="/account/password"
          className={({ isActive }) =>
            isActive
              ? "py-3 px-4 border-b-2 border-blue-600 text-blue-600"
              : "py-3 px-4 hover:text-[#2663ec]"
          }
        >
          Đổi mật khẩu
        </NavLink>
        <NavLink
          to="/account/historyTour"
          className={({ isActive }) =>
            isActive
              ? "py-3 px-4 border-b-2 border-blue-600 text-blue-600"
              : "py-3 px-4 hover:text-[#2663ec]"
          }
        >
          Lịch sử đặt tour
        </NavLink>
        <NavLink
          to="/account/favouriteTour"
          className={({ isActive }) =>
            isActive
              ? "py-3 px-4 border-b-2 border-blue-600 text-blue-600"
              : "py-3 px-4 hover:text-[#2663ec]"
          }
        >
          Tour yêu thích
        </NavLink>
      </div>
      <div className="p-8">
        <Outlet />
      </div>
    </div>
  );
}

