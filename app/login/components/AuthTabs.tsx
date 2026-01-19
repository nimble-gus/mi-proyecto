"use client";

type AuthMode = "login" | "register";

interface AuthTabsProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}

export function AuthTabs({ mode, onModeChange }: AuthTabsProps) {
  return (
    <div className="mb-6 flex gap-1 rounded-lg border border-[#E5E7EB] bg-[#F3F4F6] p-1">
      <button
        type="button"
        onClick={() => onModeChange("login")}
        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
          mode === "login"
            ? "bg-white text-[#111827] shadow-sm"
            : "text-[#6B7280] hover:text-[#111827]"
        }`}
      >
        Iniciar Sesión
      </button>
      <button
        type="button"
        onClick={() => onModeChange("register")}
        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
          mode === "register"
            ? "bg-white text-[#111827] shadow-sm"
            : "text-[#6B7280] hover:text-[#111827]"
        }`}
      >
        Registrarse
      </button>
    </div>
  );
}
