"use client";

import RegisterForm from "@/components/auth/register-form";
import { useLanguage } from "@/lib/i18n/language-context";
import { Logo } from "@/components/ui/logo";

export default function RegisterPage() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Logo width={100} height={100} />
          </div>
          <h2 className="mt-2 text-4xl font-bold tracking-tight">GENIUS</h2>
          <p className="text-xl">TESTOSTERONE</p>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}
