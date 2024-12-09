"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { EyeFilledIcon } from "../../../../../public/images/icon/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../../../../../public/images/icon/EyeSlashFilledIcon";
import ShowPassStrength from "./ShowPassStrength";
import { passwordStrength } from "check-password-strength";
import { SignUpInputProps } from "@/types/credInputs";
import { z } from "zod";
import createUser from "../../../../../actions/user";
import { UserRole } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import GoogleSigninButton from "@/components/BackOffice/Auth/GoogleSigninButton";
import { useRouter } from "next/navigation";

type Strength = 0 | 1 | 2 | 3;

const FormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(45, "First name must be less than 45 characters")
      .regex(new RegExp("^[a-zA-Z- ]+$"), "No special character allowed!"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(45, "Last name must be less than 45 characters")
      .regex(new RegExp("^[a-zA-Z ]+$"), "No special character allowed!"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters ")
      .max(50, "Password must be less than 50 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters ")
      .max(50, "Password must be less than 50 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password doesn't match!",
    path: ["confirmPassword"],
  });

// Add this function before the component
const calculateStrength = (password: string): number => {
  return passwordStrength(password).id;
};

export default function RegisterForm({
  role = "PET_OWNER",
}: {
  role?: UserRole;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SignUpInputProps>({
    resolver: zodResolver(FormSchema),
  });
  async function onSubmit(data: SignUpInputProps) {
    const name = `${data.firstName} ${data.lastName}`;
    data.name = name;

    console.log(data);
    setLoading(true);

    data.role = role;
    try {
      const user = await createUser(data);
      console.log(user);
      console.log(user.status);
      if (user && user.status === 200) {
        console.log("User Created Successfully");
        reset();
        setLoading(false);
        toast.success("User Created Successfully");
        console.log(user.data);
        router.push(`/verify-account/${user.data?.id}`);
      } else {
        console.log(user.error);
        setLoading(false);
        toast.error("User Creation Failed");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Password Visibility state
  const [passwordIsVisible, passwordSetIsVisible] = React.useState(false);
  const passwordToggleVisibility = () => passwordSetIsVisible((prev) => !prev);

  // Password Strength state
  const [strength, setStrength] = useState(0);
  const [pass, setPass] = useState<string>("");
  useEffect(() => {
    setStrength(calculateStrength(pass));
  }, [pass]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              First name
            </label>
            <input
              {...register("firstName", { required: true })}
              autoComplete="family-name"
              type="text"
              name="firstName"
              id="firstName"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
              placeholder="Juan"
            />
            {errors.firstName?.message && (
              <p className="pt-2 text-xs text-red-600">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Last name
            </label>
            <input
              {...register("lastName", { required: true })}
              autoComplete="family-name"
              type="text"
              name="lastName"
              id="lastName"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
              placeholder="Dela Cruz"
            />
            {errors.lastName?.message && (
              <p className="pt-2 text-xs text-red-600">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Email Address
          </label>
          <input
            {...register("email", { required: true })}
            autoComplete="email"
            type="email"
            name="email"
            id="email"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
            placeholder="juandelacruz@email.com"
          />
          {errors.email?.message && (
            <p className="pt-2 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <div className="relative">
            <span
              className="absolute right-4.5 top-1/2 -translate-y-1/2 focus:outline-none"
              role="button"
              onClick={passwordToggleVisibility}
              aria-label="toggle password visibility"
            >
              {passwordIsVisible ? (
                <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
              ) : (
                <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
              )}
            </span>
            <input
              {...register("password", { required: true })}
              autoComplete="new-password"
              onChange={(e) => setPass(e.target.value)}
              type={passwordIsVisible ? "text" : "password"}
              name="password"
              id="password"
              placeholder="••••••••"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {errors.password?.message && (
            <p className="pt-2 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
          <ShowPassStrength strength={strength as Strength} />
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              autoComplete="current-password"
              type="password"
              placeholder="••••••••"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {errors.confirmPassword?.message && (
            <p className="pt-2 text-xs text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        {loading ? (
          <button
            disabled
            type="button"
            className="mr-2 inline-flex w-full cursor-not-allowed justify-center rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white"
          >
            <svg
              aria-hidden="true"
              role="status"
              className="mr-3 inline h-4 w-4 animate-spin text-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
            Creating please wait...
          </button>
        ) : (
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primaryho focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Create Account
          </button>
        )}
      </form>
      <div className="flex items-center ">
        <div className="h-[1px] w-full bg-slate-500"></div>
        <span className="mx-2">or</span>
        <div className="h-[1px] w-full bg-slate-500"></div>
      </div>
      <GoogleSigninButton text="Sign up" />
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
