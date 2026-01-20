"use client";

import { useState, FormEvent } from "react";
import { TextInput, PasswordInput, PrimaryButton } from "@/src/shared/components/forms";

interface LoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export function LoginForm({ onSubmit, loading = false, error }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    // Por el momento, no hay validación - solo redirige
    // El botón de login da acceso directo a la búsqueda
    try {
      await onSubmit(username.trim() || "usuario", password || "password");
    } catch (err) {
      // El error se maneja en el componente padre
      setFormError("Error al iniciar sesión. Por favor, intenta nuevamente.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-lg border border-[#EF4444]/30 bg-[#FEE2E2] p-3">
          <p className="text-sm text-[#DC2626]" role="alert">
            {error}
          </p>
        </div>
      )}

      {formError && (
        <div className="rounded-lg border border-[#EF4444]/30 bg-[#FEE2E2] p-3">
          <p className="text-sm text-[#DC2626]" role="alert">
            {formError}
          </p>
        </div>
      )}

      <TextInput
        id="username"
        label="Nombre de Usuario"
        placeholder="Ingresa tu nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
        required
        autoComplete="username"
      />

      <PasswordInput
        id="password"
        label="Contraseña"
        placeholder="Ingresa tu contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        required
        autoComplete="current-password"
      />

      <PrimaryButton type="submit" loading={loading} disabled={loading}>
        Ingresar
      </PrimaryButton>
    </form>
  );
}
