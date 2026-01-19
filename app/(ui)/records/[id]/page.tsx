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
    <div className="min-h-screen bg-white font-sans">
      <main className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        {/* Header sticky con botón volver, título y editar */}
        <div className="sticky top-0 z-10 mb-6 flex items-center gap-4 border-b border-[#E5E7EB] bg-white py-4">
          <button
            type="button"
            onClick={handleGoBack}
            className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#111827] transition-colors hover:bg-[#F3F4F6]"
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
          <h1 className="flex-1 text-2xl font-semibold text-[#111827] lg:text-3xl">
            Detalles del Proyecto
          </h1>
          <button
            type="button"
            className="-ml-2 rounded-lg border border-[#E5E7EB] bg-white px-16 py-2 text-sm font-medium text-[#111827] transition-colors hover:bg-[#F3F4F6]"
          >
            Editar
          </button>
        </div>

        {/* Contenido de detalles */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <RecordDetailsContent
            details={details}
            loadingDetails={loadingDetails}
            errorDetails={errorDetails}
          />
        </div>

        {/* Imagen del proyecto */}
        {details?.url_imagen && (
          <div className="mt-6 rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#111827]">
              Imagen del Proyecto
            </h2>
            <div className="flex justify-center">
              <img
                src={details.url_imagen}
                alt={`Imagen de ${details.proyecto}`}
                className="max-h-[600px] w-full rounded-lg object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<p class="text-[#6B7280] text-center py-8">No se pudo cargar la imagen</p>';
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Footer sticky con botón guardar */}
        <div className="sticky bottom-0 z-10 mt-6 flex justify-center border-t border-[#E5E7EB] bg-white py-4">
          <button
            type="button"
            className="rounded-lg bg-[#1F3A5F] px-6 py-2 text-base font-medium text-white transition-colors hover:bg-[#162943]"
          >
            Guardar
          </button>
        </div>
      </main>
    </div>
  );
}
