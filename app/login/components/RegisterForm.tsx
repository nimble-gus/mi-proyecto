"use client";

import { useState, FormEvent } from "react";
import { TextInput } from "./TextInput";
import { PasswordInput } from "./PasswordInput";
import { PrimaryButton } from "./PrimaryButton";

interface RegisterFormProps {
  onSubmit: (username: string, email: string, password: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export function RegisterForm({ onSubmit, loading = false, error }: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    // Validación básica
    if (!username.trim()) {
      setFormError("El nombre de usuario es requerido");
      return;
    }

    if (!email.trim()) {
      setFormError("El correo electrónico es requerido");
      return;
    }

    // Validación simple de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError("El correo electrónico no es válido");
      return;
    }

    if (!password.trim()) {
      setFormError("La contraseña es requerida");
      return;
    }

    if (password.length < 6) {
      setFormError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Las contraseñas no coinciden");
      return;
    }

    try {
      await onSubmit(username.trim(), email.trim(), password);
    } catch (err) {
      // El error se maneja en el componente padre
      setFormError("Error al registrarse. Por favor, intenta nuevamente.");
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
        id="register-username"
        label="Nombre de Usuario"
        placeholder="Ingresa tu nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
        required
        autoComplete="username"
      />

      <TextInput
        id="register-email"
        label="Correo Electrónico"
        type="email"
        placeholder="correo@ejemplo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        required
        autoComplete="email"
      />

      <PasswordInput
        id="register-password"
        label="Contraseña"
        placeholder="Mínimo 6 caracteres"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        required
        autoComplete="new-password"
      />

      <PasswordInput
        id="register-confirm-password"
        label="Confirmar Contraseña"
        placeholder="Confirma tu contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={loading}
        required
        autoComplete="new-password"
      />

      <PrimaryButton type="submit" loading={loading} disabled={loading}>
        Registrarse
      </PrimaryButton>
    </form>
  );
}
