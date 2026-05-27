import type { RegisterOptions, UseFormGetValues } from "react-hook-form";
import * as yup from "yup";

type Rules = {
  [key in "email" | "password" | "confirm_password"]?: RegisterOptions;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: "Email là bắt buộc",
    },
    pattern: {
      value: /^[A-Za-z1-9]+@gmail.com$/,
      message: "Email không đúng định dạng",
    },
    maxLength: {
      value: 160,
      message: "Độ dài từ 5 đến 160 kí tự",
    },
    minLength: {
      value: 5,
      message: "Độ dài từ 5 đến 160 kí tự",
    },
  },
  password: {
    required: {
      value: true,
      message: "Mật khẩu là bắt buộc",
    },
    minLength: {
      value: 6,
      message: "Độ dài từ 6 đến 160 kí tự",
    },
    maxLength: {
      value: 160,
      message: "Độ dài từ 6 đến 160 kí tự",
    },
  },
  confirm_password: {
    required: {
      value: true,
      message: "Nhập lại mật khẩu là bắt buộc",
    },
    minLength: {
      value: 6,
      message: "Độ dài từ 6 đến 160 kí tự",
    },
    maxLength: {
      value: 160,
      message: "Độ dài từ 6 đến 160 kí tự",
    },
    validate:
      typeof getValues === "function"
        ? (value) =>
            value === getValues("password") ? true : "Mật khẩu không khớp"
        : undefined,
  },
});

export const schema = yup.object({
  email: yup
    .string()
    .required("Email là bắt buộc")
    .email("Email không đúng định dạng")
    .min(5, "Độ dài từ 5 đến 160 kí tự")
    .max(160, "Độ dài từ 5 đến 160 kí tự"),

  password: yup
    .string()
    .required("Password là bắt buộc")
    .min(6, "Độ dài từ 6 đến 160 kí tự")
    .max(160, "Độ dài từ 6 đến 160 kí tự"),

  confirm_password: yup
    .string()
    .required("Nhập lại mật khẩu là bắt buộc")
    .min(6, "Độ dài từ 6 đến 160 kí tự")
    .max(160, "Độ dài từ 6 đến 160 kí tự")
    .oneOf([yup.ref("password")], "Mật khẩu nhập lại không khớp"),
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
    .min(6, "Độ dài từ 6 đến 160 kí tự")
    .max(160, "Độ dài từ 6 đến 160 kí tự"),

  newPassword: yup
    .string()
    .required("Mật khẩu mới là bắt buộc")
    .min(6, "Độ dài từ 6 đến 160 kí tự")
    .max(160, "Độ dài từ 6 đến 160 kí tự")
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
    .min(6, "Độ dài từ 6 đến 160 kí tự")
    .max(160, "Độ dài từ 6 đến 160 kí tự")
    .oneOf([yup.ref("newPassword")], "Mật khẩu xác nhận không khớp"),
});

export type SchemaChangePassword = yup.InferType<typeof schemaChangePassword>;
export type Schema = yup.InferType<typeof schema>;
export type SchemaProfile = yup.InferType<typeof schemaProfile>;

