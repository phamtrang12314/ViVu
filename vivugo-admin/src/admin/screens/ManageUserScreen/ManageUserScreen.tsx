/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query'
import { PlusCircle, Edit2, Users, UserPlus, ShieldCheck, Lock } from 'lucide-react'
import { toast } from 'react-toastify'

import { userAdminApi } from '@/admin/apis/userAdmin.api'
import type {
  UserAdmin,
  UserAdminListParams,
  UserCreatePayload,
  UserUpdatePayload
} from '@/admin/types/userAdmin.type'

// =========================
// Modal wrapper giống Promotion
// =========================

type SimpleModalProps = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

const SimpleModal: React.FC<SimpleModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

// =========================
// Main screen
// =========================

export default function ManageUserScreen() {
  const [searchValue, setSearchValue] = useState('')
  const [page, setPage] = useState(0)
  const size = 10

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [editingUser, setEditingUser] = useState<UserAdmin | null>(null)

  const queryParams: UserAdminListParams = {
    page,
    size,
    search: searchValue.trim() || undefined
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['adminUsers', queryParams],
    queryFn: () => userAdminApi.getAllUsers(queryParams).then((res) => res.data),
    placeholderData: keepPreviousData
  })

  const { data: statsData } = useQuery({
    queryKey: ['userStatsSummary'],
    queryFn: () => userAdminApi.getUserStats().then((res) => res.data)
  })

  const stats = statsData || {}
  const users: UserAdmin[] = data?.content || []
  const totalPages = data?.totalPages || 0
  const currentPage = data?.number || 0

  const openCreateModal = () => {
    setMode('create')
    setEditingUser(null)
    setIsModalOpen(true)
  }

  const openEditModal = (user: UserAdmin) => {
    setMode('edit')
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleCloseModal = async (shouldRefetch?: boolean) => {
    setIsModalOpen(false)
    setEditingUser(null)
    if (shouldRefetch) {
      await refetch()
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Người dùng</h1>
          <p className="text-gray-500 mt-1">
            Quản lý thông tin tài khoản người dùng trong hệ thống.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-green-600 hover:bg-green-700 text-white text-base font-semibold px-6 py-3 rounded-lg shadow-lg transition-all active:scale-95 flex items-center gap-2"
        >
          <PlusCircle size={20} />
          Tạo người dùng
        </button>
      </div>

      {/* Search */}
      <div className="bg-white shadow-md rounded-xl p-5 flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm theo tên hoặc email..."
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value)
            setPage(0)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setPage(0)
            }
          }}
        />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Tổng người dùng"
          value={stats.totalUsers || 0}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          bgClass="bg-blue-100"
        />
        <StatCard
          title="Mới tháng này"
          value={stats.newUsersThisMonth || 0}
          icon={<UserPlus className="w-6 h-6 text-green-600" />}
          bgClass="bg-green-100"
        />
        <StatCard
          title="Đang hoạt động"
          value={stats.activeUsers || 0}
          icon={<ShieldCheck className="w-6 h-6 text-yellow-600" />}
          bgClass="bg-yellow-100"
        />
        <StatCard
          title="Đã khóa"
          value={stats.lockedUsers || 0}
          icon={<Lock className="w-6 h-6 text-red-600" />}
          bgClass="bg-red-100"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200 text-gray-600 text-sm uppercase border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 font-bold text-black">Tên</th>
              <th className="px-5 py-3 font-bold text-black">Email</th>
              <th className="px-5 py-3 font-bold text-black">Số điện thoại</th>
              <th className="px-5 py-3 font-bold text-black text-center">Trạng thái</th>
              <th className="px-5 py-3 font-bold text-black text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  Đang tải dữ liệu người dùng...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  Không tìm thấy người dùng.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u.userID}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                >
                  <td className="px-5 py-4 text-sm font-semibold text-gray-900 di">{u.name}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{u.email}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{u.phoneNumber || '-'}</td>
                  <td className="px-5 py-4 text-center text-sm">
                    <span
                      className={`px-3 py-1.5 rounded-full font-medium ${
                        u.locked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {u.locked ? 'Đã khóa' : 'Hoạt động'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center text-sm">
                    <button
                      onClick={() => openEditModal(u)}
                      className="border border-blue-500 text-blue-500 rounded-lg p-2 hover:bg-blue-50 transition"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
          >
            ←
          </button>
          <span className="text-gray-700 font-medium">
            Trang {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage + 1 >= totalPages}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
          >
            →
          </button>
        </div>
      )}

      {/* Modal form */}
      <SimpleModal isOpen={isModalOpen} onClose={() => handleCloseModal()}>
        <UserForm mode={mode} user={editingUser} onClose={handleCloseModal} />
      </SimpleModal>
    </div>
  )
}

// =========================
// Stat card
// =========================

type StatCardProps = {
  title: string
  value: number
  icon: React.ReactNode
  bgClass: string
}

function StatCard({ title, value, icon, bgClass }: StatCardProps) {
  return (
    <div className="bg-white shadow-md rounded-3xl p-6 flex items-center gap-5 border border-gray-200 hover:shadow-lg transition">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bgClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-gray-600">{title}</p>
      </div>
    </div>
  )
}

// =========================
// User Form (create + edit)
// =========================

type UserFormProps = {
  mode: 'create' | 'edit'
  user: UserAdmin | null
  onClose: (shouldRefetch?: boolean) => void
}

type UserFormState = {
  name: string
  email: string
  phoneNumber: string
  locked: boolean
  password?: string
}

type UserFormErrors = Partial<Record<keyof UserFormState | 'form', string>>

const inputBase =
  'w-full border border-gray-300 rounded-xl px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50'

function UserForm({ mode, user, onClose }: UserFormProps) {
  const isEdit = mode === 'edit'

  const [form, setForm] = useState<UserFormState>({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    locked: user?.locked ?? false,
    password: ''
  })

  const [errors, setErrors] = useState<UserFormErrors>({})

  useEffect(() => {
    if (isEdit && user) {
      setForm({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        locked: user.locked,
        password: ''
      })
    } else if (!isEdit) {
      setForm({
        name: '',
        email: '',
        phoneNumber: '',
        locked: false,
        password: ''
      })
    }
  }, [isEdit, user])

  const createMutation = useMutation({
    mutationFn: (payload: UserCreatePayload) => userAdminApi.createUser(payload)
  })

  const updateMutation = useMutation({
    mutationFn: (payload: UserUpdatePayload) => {
      if (!user) throw new Error('Missing user for update')
      return userAdminApi.updateUser(user.userID, payload)
    }
  })

  const validate = (): UserFormErrors => {
    const newErrors: UserFormErrors = {}

    if (!form.name.trim()) newErrors.name = 'Tên là bắt buộc'
    if (!form.email.trim()) newErrors.email = 'Email là bắt buộc'

    if (!isEdit) {
      if (!form.password || form.password.length < 6) {
        newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
      }
    }

    return newErrors
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'locked') {
      setForm((prev) => ({ ...prev, locked: value === 'true' }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      if (isEdit) {
        const payload: UserUpdatePayload = {
          name: form.name.trim(),
          phoneNumber: form.phoneNumber.trim() || undefined,
          email: ''
        }
        await updateMutation.mutateAsync(payload)
        toast.success('Cập nhật người dùng thành công')
      } else {
        const payload: UserCreatePayload = {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password || '',
          phoneNumber: form.phoneNumber.trim() || undefined,
          locked: form.locked
        }
        await createMutation.mutateAsync(payload)
        toast.success('Tạo người dùng thành công')
      }
      onClose(true)
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'Lỗi lưu dữ liệu người dùng'
      setErrors((prev) => ({ ...prev, form: message }))
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  return (
    <div className="bg-white text-base w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b flex-shrink-0 bg-gray-50">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            {isEdit ? 'Chỉnh sửa người dùng' : 'Tạo người dùng mới'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý thông tin tài khoản người dùng trong hệ thống.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onClose()}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col h-full flex-1 overflow-hidden">
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {errors.form && <div className="mb-4 text-sm text-red-500">{errors.form}</div>}

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Thông tin tài khoản</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Họ và tên</label>
                {errors.name && <p className="text-xs text-red-500 mb-1">{errors.name}</p>}
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputBase}
                  disabled={isSaving || isEdit}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                {errors.email && <p className="text-xs text-red-500 mb-1">{errors.email}</p>}
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputBase}
                  disabled={isSaving || isEdit}
                />
              </div>
            </div>

            {!isEdit && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Mật khẩu</label>
                  {errors.password && (
                    <p className="text-xs text-red-500 mb-1">{errors.password}</p>
                  )}
                  <input
                    name="password"
                    type="password"
                    value={form.password || ''}
                    onChange={handleChange}
                    className={inputBase}
                    disabled={isSaving}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Số điện thoại
                </label>
                <input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className={inputBase}
                  disabled={isSaving || isEdit}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Trạng thái</label>
                <select
                  name="locked"
                  value={form.locked ? 'true' : 'false'}
                  onChange={handleChange}
                  className={inputBase}
                  disabled={isSaving}
                >
                  <option value="false">Hoạt động</option>
                  <option value="true">Khóa tài khoản</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-3 p-6 border-top border-t bg-gray-50 flex-shrink-0">
          <button
            type="button"
            onClick={() => onClose()}
            className="px-6 py-3 rounded-xl border border-gray-300 text-base text-gray-700"
            disabled={isSaving}
          >
            Hủy
          </button>
          <button
            type="submit"
            className={`px-7 py-3 rounded-xl bg-blue-600 text-base text-white font-semibold flex items-center gap-2 ${
              isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            disabled={isSaving}
          >
            {isSaving && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {isEdit ? 'Lưu thay đổi' : 'Tạo người dùng'}
          </button>
        </div>
      </form>
    </div>
  )
}

// "use client"

// import { useState } from "react"
// import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query"
// import { Eye, Edit3, X, PlusCircle } from "lucide-react"
// import { toast } from "react-toastify"
// import { userAdminApi } from "@/admin/apis/userAdmin.api"
// import type { UserAdmin, UserAdminListParams } from "../../types/userAdmin.type"

// /* ================================================================
//    SIMPLE MODAL (GIỐNG PROMOTION)
// ================================================================ */
// function SimpleModal({
//   isOpen,
//   onClose,
//   children,
// }: {
//   isOpen: boolean
//   onClose: () => void
//   children: React.ReactNode
// }) {
//   // Khóa scroll khi mở modal
//   if (typeof document !== "undefined") {
//     document.body.style.overflow = isOpen ? "hidden" : "unset"
//   }

//   if (!isOpen) return null

//   return (
//     <div
//       className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col h-full"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {children}
//       </div>
//     </div>
//   )
// }

// /* ================================================================
//    MAIN SCREEN – MANAGE USER
// ================================================================ */
// export default function ManageUserScreen() {
//   const [search, setSearch] = useState("")
//   const [page, setPage] = useState(0)
//   const size = 10

//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [editingUserId, setEditingUserId] = useState<string | null>(null)

//   const queryParams: UserAdminListParams = {
//     page,
//     size,
//     search: search.trim() || undefined,
//   }

//   const { data, isLoading, refetch } = useQuery({
//     queryKey: ["adminUsers", queryParams],
//     queryFn: () => userAdminApi.getAllUsers(queryParams).then((res) => res.data),
//     placeholderData: keepPreviousData,
//   })

//   const { data: statsData } = useQuery({
//     queryKey: ["userStats"],
//     queryFn: () => userAdminApi.getUserStats().then((res) => res.data),
//   })

//   const stats = statsData || {}
//   const users: UserAdmin[] = data?.content || []
//   const totalPages = data?.totalPages || 0
//   const currentPage = data?.number || 0

//   const handleOpenCreate = () => {
//     setEditingUserId(null)
//     setIsModalOpen(true)
//   }

//   const handleOpenEdit = (id: string) => {
//     setEditingUserId(id)
//     setIsModalOpen(true)
//   }

//   const handleCloseModal = (shouldRefetch?: boolean) => {
//     setIsModalOpen(false)
//     setEditingUserId(null)
//     if (shouldRefetch) {
//       refetch()
//     }
//   }

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Quản lý Người dùng</h1>
//           <p className="text-gray-500 mt-1">Theo dõi & quản trị người dùng toàn hệ thống</p>
//         </div>

//         <button
//           onClick={handleOpenCreate}
//           className="bg-green-600 hover:bg-green-700 text-white text-base font-semibold px-6 py-3 rounded-lg shadow-lg transition-all active:scale-95 flex items-center gap-2"
//         >
//           <PlusCircle size={20} /> Tạo người dùng
//         </button>
//       </div>

//       {/* Search */}
//       <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 flex items-center gap-4 border border-gray-200">
//         <input
//           type="text"
//           placeholder="Tìm theo tên, email hoặc SĐT..."
//           className="border bg-gray-50 border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 outline-none transition"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && setPage(0)}
//         />
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <StatBox title="Tổng người dùng" value={stats.totalUsers ?? 0} color="blue" />
//         <StatBox title="Mới tháng này" value={stats.newUsersThisMonth ?? 0} color="green" />
//         <StatBox title="Đang hoạt động" value={stats.activeUsers ?? 0} color="yellow" />
//         <StatBox title="Đã khóa" value={stats.lockedUsers ?? 0} color="red" />
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
//         <table className="w-full text-left border-collapse">
//           <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
//             <tr>
//               <th className="px-6 py-3 font-semibold">Tên</th>
//               <th className="px-6 py-3 font-semibold">Email</th>
//               <th className="px-6 py-3 font-semibold">SĐT</th>
//               <th className="px-6 py-3 font-semibold text-center">Trạng thái</th>
//               <th className="px-6 py-3 font-semibold text-center">Thao tác</th>
//             </tr>
//           </thead>

//           <tbody>
//             {isLoading ? (
//               <tr>
//                 <td colSpan={5} className="text-center py-10 text-gray-500">
//                   Đang tải dữ liệu...
//                 </td>
//               </tr>
//             ) : users.length === 0 ? (
//               <tr>
//                 <td colSpan={5} className="text-center py-10 text-gray-500">
//                   Không tìm thấy người dùng
//                 </td>
//               </tr>
//             ) : (
//               users.map((u) => (
//                 <tr key={u.userID} className="border-b hover:bg-gray-50 transition">
//                   <td className="px-6 py-4 font-medium">{u.name}</td>
//                   <td className="px-6 py-4">{u.email}</td>
//                   <td className="px-6 py-4">{u.phoneNumber || "N/A"}</td>

//                   <td className="px-6 py-4 text-center">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                         u.locked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
//                       }`}
//                     >
//                       {u.locked ? "Đã khóa" : "Hoạt động"}
//                     </span>
//                   </td>

//                   <td className="px-6 py-4 text-center">
//                     <div className="inline-flex gap-3">
//                       <button
//                         onClick={() => handleOpenEdit(u.userID)}
//                         className="p-2 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 transition"
//                       >
//                         <Edit3 size={17} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-6 mt-8">
//           <button
//             onClick={() => setPage(currentPage - 1)}
//             disabled={currentPage === 0}
//             className="px-4 py-2 border rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40"
//           >
//             ←
//           </button>

//           <span className="text-gray-700 font-medium">
//             Trang {currentPage + 1} / {totalPages}
//           </span>

//           <button
//             onClick={() => setPage(currentPage + 1)}
//             disabled={currentPage + 1 >= totalPages}
//             className="px-4 py-2 border rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40"
//           >
//             →
//           </button>
//         </div>
//       )}

//       {/* Modal Form User */}
//       <SimpleModal isOpen={isModalOpen} onClose={() => handleCloseModal(false)}>
//         <UserForm userId={editingUserId} onClose={handleCloseModal} />
//       </SimpleModal>
//     </div>
//   )
// }

// /* ================================================================
//    STAT BOX
// ================================================================ */
// type StatColor = "blue" | "green" | "yellow" | "red"

// const iconMap: Record<StatColor, JSX.Element> = {
//   blue: (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="w-7 h-7 text-blue-600"
//       fill="none"
//       viewBox="0 0 24 24"
//       strokeWidth="2"
//       stroke="currentColor"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M16 14c2.21 0 4 1.79 4 4v1H4v-1c0-2.21 1.79-4 4-4m8-10a4 4 0 11-8 0 4 4 0 018 0z"
//       />
//     </svg>
//   ),

//   green: (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="w-6 h-6 text-green-600"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9l-6 6-3-3" />
//     </svg>
//   ),

//   yellow: (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="w-6 h-6 text-yellow-600"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//     </svg>
//   ),

//   red: (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="w-6 h-6 text-red-600"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M12 11c.6 0 1.1-.49 1.1-1.1v-.8c0-.6-.5-1.1-1.1-1.1s-1.1.5-1.1 1.1v.8c0 .61.5 1.1 1.1 1.1zm0 8c-.6 0-1.1-.49-1.1-1.1v-.8c0-.6.5-1.1 1.1-1.1s1.1.5 1.1 1.1v.8c0 .61-.5 1.1-1.1 1.1zM19 15V9a7 7 0 10-14 0v6a7 7 0 0014 0z"
//       />
//     </svg>
//   ),
// }

// const bgMap: Record<StatColor, string> = {
//   blue: "bg-blue-100",
//   green: "bg-green-100",
//   yellow: "bg-yellow-100",
//   red: "bg-red-100",
// }

// function StatBox({
//   title,
//   value,
//   color,
// }: {
//   title: string
//   value: number
//   color: StatColor
// }) {
//   return (
//     <div className="bg-white shadow-md rounded-3xl p-6 flex items-center gap-5 border border-gray-200 hover:shadow-lg transition">
//       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bgMap[color]}`}>
//         {iconMap[color]}
//       </div>

//       <div>
//         <p className="text-2xl font-bold text-gray-900">{value}</p>
//         <p className="text-gray-600">{title}</p>
//       </div>
//     </div>
//   )
// }

// /* ================================================================
//    USER FORM (CREATE + EDIT)
// ================================================================ */
// type UserFormProps = {
//   userId: string | null
//   onClose: (refresh?: boolean) => void
// }

// type UserFormState = {
//   name: string
//   email: string
//   phoneNumber: string
//   locked: boolean
// }

// type UserFormErrors = Partial<Record<keyof UserFormState, string>> & {
//   form?: string
// }

// function UserForm({ userId, onClose }: UserFormProps) {
//   const isEdit = Boolean(userId)

//   const [form, setForm] = useState<UserFormState>({
//     name: "",
//     email: "",
//     phoneNumber: "",
//     locked: false,
//   })

//   const [errors, setErrors] = useState<UserFormErrors>({})

//   const { data, isLoading } = useQuery({
//     queryKey: ["admin-user-detail", userId],
//     queryFn: () => userAdminApi.getUserDetail(userId as string).then((res) => res.data),
//     enabled: isEdit && !!userId,
//   })

//   const createMutation = useMutation({
//     mutationFn: (payload: UserFormState) => userAdminApi.createUser(payload),
//   })

//   const updateMutation = useMutation({
//     mutationFn: (payload: UserFormState) => userAdminApi.updateUser(userId as string, payload),
//   })

//   // Fill form khi edit
//   if (isEdit && data && form.name === "" && form.email === "" && form.phoneNumber === "") {
//     setForm({
//       name: data.name || "",
//       email: data.email || "",
//       phoneNumber: data.phoneNumber || "",
//       locked: data.locked || false,
//     })
//   }

//   const isSaving = createMutation.isPending || updateMutation.isPending

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target
//     if (name === "locked") {
//       setForm((prev) => ({
//         ...prev,
//         locked: value === "true",
//       }))
//     } else {
//       setForm((prev) => ({
//         ...prev,
//         [name]: value,
//       }))
//     }
//     setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }))
//   }

//   const validate = (): UserFormErrors => {
//     const newErrors: UserFormErrors = {}
//     if (!form.name.trim()) newErrors.name = "Tên là bắt buộc"
//     if (!form.email.trim()) newErrors.email = "Email là bắt buộc"
//     return newErrors
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const vErr = validate()
//     if (Object.keys(vErr).length > 0) {
//       setErrors(vErr)
//       return
//     }

//     try {
//       if (isEdit) {
//         await updateMutation.mutateAsync(form)
//         toast.success("Cập nhật người dùng thành công")
//       } else {
//         await createMutation.mutateAsync(form)
//         toast.success("Tạo người dùng thành công")
//       }
//       onClose(true)
//     } catch (err: any) {
//       const msg = err?.response?.data?.message || "Lỗi lưu dữ liệu người dùng"
//       setErrors((prev) => ({ ...prev, form: msg }))
//     }
//   }

//   return (
//     <div className="bg-white text-base w-full h-full flex flex-col">
//       {/* Header Modal */}
//       <div className="flex items-center justify-between p-6 border-b flex-shrink-0 bg-gray-50">
//         <div>
//           <h1 className="text-xl font-bold text-gray-800">
//             {isEdit ? "Chỉnh sửa người dùng" : "Tạo người dùng mới"}
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Quản lý thông tin tài khoản người dùng trong hệ thống.
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={() => onClose(false)}
//           className="text-gray-400 hover:text-gray-600"
//         >
//           <X size={22} />
//         </button>
//       </div>

//       {isEdit && isLoading ? (
//         <div className="flex-1 flex items-center justify-center p-12 text-base">
//           Đang tải thông tin người dùng...
//         </div>
//       ) : (
//         <form
//           onSubmit={handleSubmit}
//           className="flex flex-col h-full flex-1 overflow-hidden"
//         >
//           <div className="p-6 space-y-6 overflow-y-auto flex-1">
//             {errors.form && (
//               <div className="mb-4 text-sm text-red-500">{errors.form}</div>
//             )}

//             {/* Thông tin cơ bản */}
//             <section className="space-y-4">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 Thông tin tài khoản
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Họ và tên
//                   </label>
//                   {errors.name && (
//                     <p className="text-xs text-red-500 mb-1">{errors.name}</p>
//                   )}
//                   <input
//                     name="name"
//                     value={form.name}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-xl px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
//                     placeholder="Nhập họ tên"
//                     disabled={isSaving}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Email
//                   </label>
//                   {errors.email && (
//                     <p className="text-xs text-red-500 mb-1">{errors.email}</p>
//                   )}
//                   <input
//                     name="email"
//                     type="email"
//                     value={form.email}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-xl px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
//                     placeholder="Nhập email"
//                     disabled={isSaving}
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Số điện thoại
//                   </label>
//                   {errors.phoneNumber && (
//                     <p className="text-xs text-red-500 mb-1">
//                       {errors.phoneNumber}
//                     </p>
//                   )}
//                   <input
//                     name="phoneNumber"
//                     value={form.phoneNumber}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-xl px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
//                     placeholder="Nhập số điện thoại"
//                     disabled={isSaving}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Trạng thái
//                   </label>
//                   <select
//                     name="locked"
//                     value={form.locked ? "true" : "false"}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-xl px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
//                     disabled={isSaving}
//                   >
//                     <option value="false">Hoạt động</option>
//                     <option value="true">Khóa tài khoản</option>
//                   </select>
//                 </div>
//               </div>
//             </section>
//           </div>

//           {/* Footer */}
//           <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 flex-shrink-0">
//             <button
//               type="button"
//               onClick={() => onClose(false)}
//               className="px-6 py-3 rounded-xl border border-gray-300 text-base text-gray-700"
//               disabled={isSaving}
//             >
//               Hủy
//             </button>
//             <button
//               type="submit"
//               className={`px-7 py-3 rounded-xl bg-blue-600 text-base text-white font-semibold flex items-center gap-2 ${
//                 isSaving ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
//               }`}
//               disabled={isSaving}
//             >
//               {isSaving && (
//                 <svg
//                   className="animate-spin h-5 w-5 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//               )}
//               {isEdit ? "Lưu thay đổi" : "Tạo người dùng"}
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   )
// }

