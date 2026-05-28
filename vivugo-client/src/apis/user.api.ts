import type { User } from "../types/user.type";
import http from "../utils/http";

interface SuccessResponse<T> {
  data: T;
  message: string;
}

export type ChangePasswordBody = {
  oldPassword: string;
  newPassword: string;
};

export type UpdateProfileBody = {
  name?: string;
  phoneNumber?: string;
  address?: string;
  avatarUrl?: string;
};

const userApi = {
  updateProfile(body: UpdateProfileBody) {
    return http.put<SuccessResponse<User>>("auth/me", body);
  },
  changePassword(body: ChangePasswordBody) {
    return http.put<SuccessResponse<string>>("auth/password", body);
  },
};

export default userApi;

