// src/admin/types/userAdmin.type.ts

export type UserAdmin = {
  userID: string
  name: string
  email: string
  phoneNumber?: string
  role: string
  locked: boolean
  createdAt?: string
  updatedAt?: string
}

export type UserAdminListParams = {
  page: number
  size: number
  search?: string
}

export type UserAdminListResponse = {
  content: UserAdmin[]
  totalPages: number
  number: number
  totalElements: number
}

export type UserLockPayload = {
  lock: boolean
}

export type UserUpdatePayload = {
  name: string
  email: string
  phoneNumber?: string
}
export type UserCreatePayload = {
  name: string
  email: string
  password: string
  phoneNumber?: string
  locked: boolean
}

