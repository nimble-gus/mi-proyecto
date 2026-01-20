"use client";

type AuthMode = "login" | "register";

interface AuthTabsProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}

export function AuthTabs({ mode, onModeChange }: AuthTabsProps) {
  return (
    <div className="mb-6 flex gap-1 rounded-lg border-2 border-[#E5E7EB] bg-gradient-to-r from-[#F3F4F6] to-white p-1 shadow-inner">
      <button
        type="button"
        onClick={() => onModeChange("login")}
        className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold transition-all ${
          mode === "login"
            ? "bg-gradient-to-r from-[#4DA3FF] to-[#1F3A5F] text-white shadow-lg transform scale-105"
            : "text-[#6B7280] hover:text-[#1F3A5F] hover:bg-white/50"
        }`}
      >
        Iniciar Sesión
      </button>
      <button
        type="button"
        onClick={() => onModeChange("register")}
        className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold transition-all ${
          mode === "register"
            ? "bg-gradient-to-r from-[#4DA3FF] to-[#1F3A5F] text-white shadow-lg transform scale-105"
            : "text-[#6B7280] hover:text-[#1F3A5F] hover:bg-white/50"
        }`}
      >
        Registrarse
      </button>
    </div>
  );
}
