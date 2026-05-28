export interface User {
  userID: string;
  name: string;
  email: string;
  phoneNumber: string;
  avatarURL: string;
  address: string;
}

export interface SimpleProfile {
  userID: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

