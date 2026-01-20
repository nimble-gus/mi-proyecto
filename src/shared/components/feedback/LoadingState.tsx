interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Cargando..." }: LoadingStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-[#4DA3FF]/30 bg-gradient-to-br from-[#4DA3FF]/10 to-white p-12 text-center shadow-md">
      <div className="flex flex-col items-center gap-3">
        <svg className="h-8 w-8 animate-spin text-[#4DA3FF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-[#1F3A5F] font-semibold">{message}</p>
      </div>
    </div>
  );
}
