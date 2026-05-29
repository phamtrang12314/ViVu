import http from "../../utils/http";
import type {
  UserAdmin,
  UserAdminListParams,
  UserAdminListResponse,
  UserCreatePayload,
  UserLockPayload
} from "../types/userAdmin.type";

const URL = "/admin/users";

export const userAdminApi = {
  getAllUsers: (params: UserAdminListParams) => {
    return http.get<UserAdminListResponse>(URL, {
      params: {
        page: params.page,
        size: params.size,
        search: params.search || undefined,
      }
    });
  },

  // GET /api/admin/users/{userId}
  getUserDetail: (userId: string) => {
    return http.get(`/admin/users/${userId}`);
  },

  // PUT /api/admin/users/{userId}
  updateUser: (userId: string, payload: any) => {
    return http.put(`/admin/users/${userId}`, payload);
  },

  // PUT /api/admin/users/{userId}/lock
  lockOrUnlockUser: (userId: string, payload: UserLockPayload) => {
    return http.put(`/admin/users/${userId}/lock`, payload);
  },

  // GET /api/admin/users/{userId}/stats
//   getUserStats: (userId: string) => {
//     return http.get(`/admin/users/${userId}/stats`);
//   },

  // GET /api/admin/users/{userId}/bookings
  getUserBookings: (userId: string) => {
    return http.get(`/admin/users/${userId}/bookings`);
  },
  getUserStatsSummary: () => {
  return http.get("/admin/users/stats-summary");
},
getUserStats: () => http.get("/admin/users/stats"),
createUser: (payload: UserCreatePayload) =>
    http.post<UserAdmin>(URL, payload),

  
};

