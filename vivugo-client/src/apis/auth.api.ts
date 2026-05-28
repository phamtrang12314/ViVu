import type { AuthResponse } from "../types/auth.type";
import type { User } from "../types/user.type";
import http from "../utils/http";

export const registerAccount = (body: {
  name: string;
  email: string;
  phoneNumber: string;
  username?: string;
  password: string;
  otpCode?: string;
}) =>
  http.post<AuthResponse>("auth/register", {
    name: body.name,
    email: body.email,
    phone: body.phoneNumber || body.username,
    password: body.password,
    otpCode: body.otpCode,
  });

export const requestRegisterOtp = (body: { email: string }) =>
  http.post<AuthResponse>("auth/register/request-otp", body);

export const requestForgotPasswordOtp = (body: { email: string }) =>
  http.post<AuthResponse>("auth/forgot-password/request-otp", body);

export const resetPassword = (body: { email: string; otpCode: string; newPassword: string }) =>
  http.post<AuthResponse>("auth/reset-password", body);

export const loginAccount = (body: { email?: string; phone?: string; password: string }) =>
  http.post("auth/login", { phone: body.phone || body.email, password: body.password });

export const logout = () => http.post("auth/logout");

export const getProfile = () => http.get<User>("auth/me");

