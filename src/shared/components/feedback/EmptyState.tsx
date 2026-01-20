interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ message = "No hay resultados", icon }: EmptyStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-[#E5E7EB] bg-gradient-to-br from-[#F3F4F6] to-white p-12 text-center shadow-md">
      <div className="flex flex-col items-center gap-3">
        {icon || (
          <svg className="h-8 w-8 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        <p className="text-[#6B7280] font-semibold">{message}</p>
      </div>
    </div>
  );
}
