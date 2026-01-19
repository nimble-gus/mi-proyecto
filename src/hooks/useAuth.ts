"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      // Por el momento, no hay validación real - solo redirige
      // Simulamos un pequeño delay para mejor UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Guardar sesión en localStorage (solo para estructura)
      localStorage.setItem("auth_session", JSON.stringify({
        username: credentials.username || "usuario",
        timestamp: Date.now(),
      }));

      // Redirigir a la página de búsqueda
      router.push("/search");
      router.refresh();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al iniciar sesión. Por favor, intenta nuevamente.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setLoading(true);
    setError(null);

    try {
      // Por el momento, no hay validación real - solo redirige
      // Simulamos un pequeño delay para mejor UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Guardar sesión en localStorage (solo para estructura)
      localStorage.setItem("auth_session", JSON.stringify({
        username: credentials.username || "usuario",
        email: credentials.email || "",
        timestamp: Date.now(),
      }));

      // Redirigir a la página de búsqueda después del registro
      router.push("/search");
      router.refresh();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al registrarse. Por favor, intenta nuevamente.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  return {
    login,
    register,
    loading,
    error,
  };
}
