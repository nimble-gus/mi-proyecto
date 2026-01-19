"use client";

interface PrimaryButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function PrimaryButton({
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  children,
  className = "",
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full rounded-lg bg-[#1F3A5F] px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[#162943] focus:outline-none focus:ring-2 focus:ring-[#1F3A5F] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#1F3A5F] ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="h-5 w-5 animate-spin"
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
          {typeof children === "string" ? children.replace("Ingresar", "Ingresando...").replace("Registrarse", "Registrando...") : children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
