import type { RegisterOptions, UseFormGetValues } from "react-hook-form";
import * as yup from "yup";

type Rules = {
  [key in "name" | "email" | "phoneNumber" | "password" | "confirm_password" | "otpCode"]?: RegisterOptions;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  name: {
    required: {
      value: true,
      message: "Tên là bắt buộc",
    },
    minLength: {
      value: 2,
      message: "Tên phải có ít nhất 2 ký tự",
    },
    maxLength: {
      value: 100,
      message: "Tên không được vượt quá 100 ký tự",
    },
  },
  email: {
    required: {
      value: true,
      message: "Email là bắt buộc",
    },
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Email không đúng định dạng",
    },
    maxLength: {
      value: 160,
      message: "Độ dài từ 5 đến 160 ký tự",
    },
    minLength: {
      value: 5,
      message: "Độ dài từ 5 đến 160 ký tự",
    },
  },
  phoneNumber: {
    required: {
      value: true,
      message: "Số điện thoại là bắt buộc",
    },
    pattern: {
      value: /^(0|\+?84)[0-9]{9,10}$/,
      message: "Số điện thoại không hợp lệ",
    },
  },
  password: {
    required: {
      value: true,
      message: "Mật khẩu là bắt buộc",
    },
    minLength: {
      value: 8,
      message: "Mật khẩu phải có ít nhất 8 ký tự",
    },
    maxLength: {
      value: 160,
      message: "Mật khẩu không được vượt quá 160 ký tự",
    },
  },
  confirm_password: {
    required: {
      value: true,
      message: "Nhập lại mật khẩu là bắt buộc",
    },
    minLength: {
      value: 8,
      message: "Mật khẩu xác nhận phải có ít nhất 8 ký tự",
    },
    maxLength: {
      value: 160,
      message: "Mật khẩu xác nhận không được vượt quá 160 ký tự",
    },
    validate:
      typeof getValues === "function"
        ? (value) =>
            value === getValues("password") ? true : "Mật khẩu không khớp"
        : undefined,
  },
  otpCode: {
    required: {
      value: true,
      message: "Mã OTP là bắt buộc",
    },
    pattern: {
      value: /^[0-9]{6}$/,
      message: "Mã OTP gồm 6 chữ số",
    },
  },
});

export const schema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Tên là bắt buộc")
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(100, "Tên không được vượt quá 100 ký tự"),

  email: yup
    .string()
    .required("Email là bắt buộc")
    .email("Email không đúng định dạng")
    .min(5, "Độ dài từ 5 đến 160 ký tự")
    .max(160, "Độ dài từ 5 đến 160 ký tự"),

  phoneNumber: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^(0|\+?84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ"),

  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(160, "Mật khẩu không được vượt quá 160 ký tự"),

  confirm_password: yup
    .string()
    .required("Nhập lại mật khẩu là bắt buộc")
    .min(8, "Mật khẩu xác nhận phải có ít nhất 8 ký tự")
    .max(160, "Mật khẩu xác nhận không được vượt quá 160 ký tự")
    .oneOf([yup.ref("password")], "Mật khẩu nhập lại không khớp"),

  otpCode: yup
    .string()
    .required("Mã OTP là bắt buộc")
    .matches(/^[0-9]{6}$/, "Mã OTP gồm 6 chữ số"),
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email là bắt buộc")
    .email("Email không đúng định dạng")
    .min(5, "Độ dài từ 5 đến 160 ký tự")
    .max(160, "Độ dài từ 5 đến 160 ký tự"),

  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Độ dài từ 6 đến 160 ký tự")
    .max(160, "Độ dài từ 6 đến 160 ký tự"),
});

export const schemaProfile = yup.object({
  name: yup
    .string()
    .trim()
    .required("Tên là bắt buộc")
    .max(100, "Tên không được vượt quá 100 ký tự")
    .nullable(),
  phoneNumber: yup
    .string()
    .notRequired()
    .matches(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số")
    .nullable(),
  address: yup
    .string()
    .notRequired()
    .max(255, "Địa chỉ không được vượt quá 255 ký tự")
    .nullable(),
  avatarUrl: yup.string().notRequired().nullable(),
});

export const schemaChangePassword = yup.object({
  oldPassword: yup
    .string()
    .required("Mật khẩu cũ là bắt buộc")
    .min(6, "Độ dài từ 6 đến 160 ký tự")
    .max(160, "Độ dài từ 6 đến 160 ký tự"),

  newPassword: yup
    .string()
    .required("Mật khẩu mới là bắt buộc")
    .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
    .max(160, "Độ dài từ 6 đến 160 ký tự")
    .test(
      "is-different",
      "Mật khẩu mới phải khác mật khẩu cũ",
      function (value) {
        return value !== this.parent.oldPassword;
      }
    ),

  confirmNewPassword: yup
    .string()
    .required("Xác nhận mật khẩu mới là bắt buộc")
    .min(8, "Mật khẩu xác nhận phải có ít nhất 8 ký tự")
    .max(160, "Độ dài từ 6 đến 160 ký tự")
    .oneOf([yup.ref("newPassword")], "Mật khẩu xác nhận không khớp"),
});

export type SchemaChangePassword = yup.InferType<typeof schemaChangePassword>;
export type Schema = yup.InferType<typeof schema>;
export type LoginSchema = yup.InferType<typeof loginSchema>;
export type SchemaProfile = yup.InferType<typeof schemaProfile>;
