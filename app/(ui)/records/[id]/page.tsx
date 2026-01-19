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
        <div className="sticky top-0 z-10 mb-6 flex items-center gap-4 border-b-2 border-[#4DA3FF]/20 bg-gradient-to-r from-white via-[#F3F4F6]/30 to-white py-4 backdrop-blur-sm">
          <button
            type="button"
            onClick={handleGoBack}
            className="flex items-center gap-2 rounded-lg border-2 border-[#4DA3FF] bg-[#4DA3FF]/10 px-4 py-2 text-sm font-semibold text-[#4DA3FF] transition-all hover:bg-[#4DA3FF] hover:text-white hover:shadow-md"
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
          <h1 className="flex-1 text-2xl font-semibold bg-gradient-to-r from-[#1F3A5F] to-[#4DA3FF] bg-clip-text text-transparent lg:text-3xl">
            Detalles del Proyecto
          </h1>
          <button
            type="button"
            className="-ml-2 rounded-lg border-2 border-[#4DA3FF] bg-gradient-to-r from-[#4DA3FF] to-[#1F3A5F] px-16 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:from-[#1F3A5F] hover:to-[#4DA3FF] hover:shadow-xl hover:scale-105"
          >
            Editar
          </button>
        </div>

        {/* Contenido de detalles */}
        <div className="rounded-lg border-2 border-[#E5E7EB] bg-gradient-to-br from-white to-[#F3F4F6]/30 p-6 shadow-lg ring-1 ring-[#4DA3FF]/10">
          <RecordDetailsContent
            details={details}
            loadingDetails={loadingDetails}
            errorDetails={errorDetails}
          />
        </div>

        {/* Imagen del proyecto */}
        {details?.url_imagen && (
          <div className="mt-6 rounded-lg border-2 border-[#E5E7EB] bg-gradient-to-br from-white to-[#4DA3FF]/5 p-6 shadow-lg ring-1 ring-[#4DA3FF]/10">
            <h2 className="mb-4 text-xl font-semibold text-[#1F3A5F] flex items-center gap-2 border-b-2 border-[#4DA3FF]/20 pb-2">
              <svg className="h-5 w-5 text-[#4DA3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
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
        <div className="sticky bottom-0 z-10 mt-6 flex justify-center border-t-2 border-[#4DA3FF]/20 bg-gradient-to-r from-white via-[#F3F4F6]/30 to-white py-4 backdrop-blur-sm">
          <button
            type="button"
            className="rounded-lg bg-gradient-to-r from-[#4DA3FF] via-[#1F3A5F] to-[#4DA3FF] bg-size-200 bg-pos-0 px-8 py-3 text-base font-semibold text-white shadow-xl transition-all hover:bg-pos-100 hover:shadow-2xl hover:scale-105"
          >
            Guardar
          </button>
        </div>
      </main>
    </div>
  );
}
