"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRecordDetails } from "@/src/hooks/useRecordDetails";
import { RecordDetailsContent } from "../../components/RecordDetailsContent";

export default function RecordDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { details, loadingDetails, errorDetails, loadDetails } = useRecordDetails();

  useEffect(() => {
    const recordId = parseInt(id, 10);
    if (!isNaN(recordId) && recordId > 0) {
      loadDetails(recordId);
    }
  }, [id, loadDetails]);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        {/* Header con botón volver */}
        <div className="mb-6 flex items-center gap-4">
          <button
            type="button"
            onClick={handleGoBack}
            className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver
          </button>
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50 lg:text-3xl">
            Detalles del Proyecto
          </h1>
        </div>

        {/* Contenido de detalles */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <RecordDetailsContent
            details={details}
            loadingDetails={loadingDetails}
            errorDetails={errorDetails}
          />
        </div>
      </main>
    </div>
  );
}
