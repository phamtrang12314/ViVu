import { type InputHTMLAttributes } from "react";
import type { RegisterOptions, UseFormRegister } from "react-hook-form";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  errorMessage?: string;
  rules?: RegisterOptions;
  classNameInput?: string;
  classNameError?: string;
}

export default function Input({
  className,
  name,
  register,
  errorMessage,
  rules,
  classNameInput = "p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm shadow-sm",
  classNameError = "mt-1 text-red-600 min-h-[1.25rem] text-sm text-left",
  ...rest
}: Props) {
  const registerResult = register && name ? register(name, rules) : null;
  return (
    <div className={className}>
      <input className={classNameInput} {...registerResult} {...rest} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  );
}

