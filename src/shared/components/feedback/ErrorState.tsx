interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-[#EF4444]/50 bg-gradient-to-br from-[#FEE2E2] to-white p-12 text-center shadow-lg ring-2 ring-[#EF4444]/20">
      <div className="flex flex-col items-center gap-3">
        <svg className="h-8 w-8 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-[#DC2626] font-semibold">{message}</p>
      </div>
    </div>
  );
}
