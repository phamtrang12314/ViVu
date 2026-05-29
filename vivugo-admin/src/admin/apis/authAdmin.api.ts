import type { AuthResponse } from "../../types/auth.type";
import http from "../../utils/http";

export const loginAdmin = (body: { phone: string; password: string }) =>
  http.post<AuthResponse>("auth/admin/login", body);

