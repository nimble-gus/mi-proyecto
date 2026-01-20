"use client";

import { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#F3F4F6] px-4 py-12 lg:h-full">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-8 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
