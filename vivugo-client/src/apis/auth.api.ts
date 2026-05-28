import http from "../utils/http";

export const logout = () => http.post("auth/logout");
