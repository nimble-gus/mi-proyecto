"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Router inteligente en la raíz (/)
 * 
 * Verifica si el usuario está autenticado:
 * - Si está autenticado: redirige a /search
 * - Si no está autenticado: redirige a /login
 */
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay sesión en localStorage
    const authSession = typeof window !== "undefined" 
      ? localStorage.getItem("auth_session") 
      : null;

    if (authSession) {
      // Usuario autenticado: redirigir a búsqueda
      router.push("/search");
    } else {
      // Usuario no autenticado: redirigir a login
      router.push("/login");
    }
  }, [router]);

  // Mostrar un estado de carga mientras se verifica la autenticación
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="mb-4 inline-block">
          <svg
            className="h-12 w-12 animate-spin text-[#4DA3FF]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <p className="text-lg font-medium text-[#1F3A5F]">Cargando...</p>
      </div>
    </div>
  );
}
