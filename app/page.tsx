"use client";

import { useState } from "react";
import { AuthIntro } from "./login/components/AuthIntro";
import { AuthCard } from "./login/components/AuthCard";
import { AuthTabs } from "./login/components/AuthTabs";
import { LoginForm } from "./login/components/LoginForm";
import { RegisterForm } from "./login/components/RegisterForm";
import { useAuth } from "@/src/hooks/useAuth";

type AuthMode = "login" | "register";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const { login, register, loading, error } = useAuth();

  const handleLogin = async (username: string, password: string) => {
    await login({ username, password });
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    await register({ username, email, password });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white lg:h-screen lg:flex-row lg:overflow-hidden">
      {/* Panel izquierdo - Contenido informativo */}
      <div className="hidden min-h-screen w-full bg-white lg:flex lg:h-screen lg:w-1/2">
        <AuthIntro />
      </div>

      {/* Panel derecho - Formulario de autenticación */}
      <div className="flex min-h-screen w-full lg:h-screen lg:w-1/2">
        <AuthCard>
          <div className="mb-6 rounded-lg bg-gradient-to-r from-[#4DA3FF]/10 via-[#1F3A5F]/5 to-[#4DA3FF]/10 p-4 border-2 border-[#4DA3FF]/20">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#1F3A5F] to-[#4DA3FF] bg-clip-text text-transparent">
              {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
            </h2>
            <p className="mt-2 text-sm text-[#6B7280] flex items-center gap-2">
              <svg className="h-4 w-4 text-[#4DA3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {mode === "login"
                ? "Ingresa tus credenciales para acceder al sistema"
                : "Completa el formulario para crear tu cuenta"}
            </p>
          </div>

          <AuthTabs mode={mode} onModeChange={setMode} />

          {mode === "login" ? (
            <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
          ) : (
            <RegisterForm onSubmit={handleRegister} loading={loading} error={error} />
          )}
        </AuthCard>

        {/* Panel informativo en mobile (debajo del formulario) */}
        <div className="mt-8 block px-4 lg:hidden">
          <AuthIntro />
        </div>
      </div>
    </div>
  );
}
