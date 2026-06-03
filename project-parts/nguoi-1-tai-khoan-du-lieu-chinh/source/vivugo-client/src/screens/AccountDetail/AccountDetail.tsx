import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../apis/auth.api";

export default function AccountDetail() {
  const { data: userData } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return getProfile();
    },
  });

  console.log(userData);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow">
        <div className="bg-blue-600 text-white rounded-t-2xl p-8 flex items-center">
          <div className="w-24 h-24 rounded-full text-blue-600 flex items-center justify-center text-5xl font-semibold">
            <img
              src="src/assets/user.png"
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
          <button className="py-3 px-4 border-b-2 border-blue-600 text-blue-600">
            Thông tin cá nhân
          </button>
          <button className="py-3 px-4 hover:text-blue-600">
            Đổi mật khẩu
          </button>
          <button className="py-3 px-4 hover:text-blue-600">
            Lịch sử đặt tour
          </button>
          <button className="py-3 px-4 hover:text-blue-600">
            Tour yêu thích
          </button>
        </div>

        <div className="p-8">
          <h3 className="text-lg font-semibold mb-6">Thông tin cá nhân</h3>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  defaultValue={userData?.data.name}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:border-blue-500 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={userData?.data.email}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:border-blue-500 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  defaultValue={userData?.data.phoneNumber}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:border-blue-500 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Giới tính
                </label>
                <select className="w-full border border-gray-300 rounded-lg p-2.5 focus:border-blue-500 focus:ring-blue-500 outline-none">
                  <option disabled>Giới tính</option>
                  <option>Nam</option>
                  <option>Nữ</option>
                  <option>Khác</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  defaultValue={userData?.data.address}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:border-blue-500 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg"
              >
                Cập nhật thông tin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

