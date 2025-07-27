"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api/auth";
import { useLanguage } from "@/lib/i18n/language-context";

interface ValidationError {
  field: string;
  message: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGeneralError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: t("auth.passwordMismatch") });
      setIsLoading(false);
      return;
    }

    try {
      const result = await authApi.register({
        email,
        firstName,
        lastName,
        password,
      });

      if (!result.error) {
        toast.success(t("auth.registerSuccess"));
        router.push("/login");
      }
    } catch (err) {
      if ((err as any)?.status === 400) {
        setGeneralError(t("auth.registerError"));
      } else {
        setGeneralError(t("auth.inesperateError"));
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-4">
        {generalError && (
          <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
            <p className="text-sm text-red-500 dark:text-red-400">
              {generalError}
            </p>
          </div>
        )}
        <div>
          <input
            name="firstName"
            type="text"
            placeholder={t("auth.firstName")}
            required
            className="w-full rounded-full border border-gray-300 px-4 py-2 focus:border-black focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          />
        </div>
        <div>
          <input
            name="lastName"
            type="text"
            placeholder={t("auth.lastName")}
            required
            className="w-full rounded-full border border-gray-300 px-4 py-2 focus:border-black focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          />
        </div>
        <div>
          <input
            name="email"
            type="email"
            placeholder={t("auth.email")}
            required
            className={`w-full rounded-full border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } px-4 py-2 focus:border-black focus:outline-none dark:border-gray-700 dark:bg-gray-800`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>
        <div>
          <input
            name="password"
            type="password"
            placeholder={t("auth.password")}
            required
            className={`w-full rounded-full border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } px-4 py-2 focus:border-black focus:outline-none dark:border-gray-700 dark:bg-gray-800`}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
          )}
        </div>
        <div>
          <input
            name="confirmPassword"
            type="password"
            placeholder={t("auth.confirmPassword")}
            required
            className={`w-full rounded-full border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } px-4 py-2 focus:border-black focus:outline-none dark:border-gray-700 dark:bg-gray-800`}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              {errors.confirmPassword}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full border border-black px-4 py-2 text-center font-semibold transition-colors hover:bg-black hover:text-white disabled:opacity-50 dark:border-white dark:hover:bg-white dark:hover:text-black"
        >
          {isLoading ? t("common.loading") : t("auth.register")}
        </button>
      </form>
      <Link
        href="/login"
        className="block w-full rounded-full border border-black px-4 py-2 text-center font-semibold transition-colors hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
      >
        {t("auth.backToLogin")}
      </Link>
    </div>
  );
}
