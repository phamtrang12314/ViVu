import type { AuthResponse } from "../types/auth.type";
import type { User } from "../types/user.type";
import http from "../utils/http";

export const registerAccount = (body: {
  name: string;
  email: string;
  phoneNumber: string;
  username: string;
  password: string;
}) => http.post<AuthResponse>("auth/register", body);

export const loginAccount = (body: { email: string; password: string }) =>
  http.post("auth/login", body);

export const logout = () => http.post("auth/logout");

export const getProfile = () => http.get<User>("auth/me");

