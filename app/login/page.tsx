"use client";

import { useState } from "react";
import { AuthIntro } from "./components/AuthIntro";
import { AuthCard } from "./components/AuthCard";
import { AuthTabs } from "./components/AuthTabs";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
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
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      {/* Panel izquierdo - Contenido informativo */}
      <div className="hidden w-full bg-white lg:block lg:w-1/2">
        <AuthIntro />
      </div>

      {/* Panel derecho - Formulario de autenticación */}
      <div className="w-full lg:w-1/2">
        <AuthCard>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[#111827]">
              {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
            </h2>
            <p className="mt-2 text-sm text-[#6B7280]">
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
