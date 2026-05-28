type Role = "CUSTOMER" | "ADMIN";
export type AuthResponse = {
    email: string;
    success: boolean;
    message: string;
    token: string;
    userID: string;
    username: string;
    role: Role;
};
export type LoginSuccessResponse = {
  data: AuthResponse;
};

