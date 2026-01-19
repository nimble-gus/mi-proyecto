"use client";

export function AuthIntro() {
  return (
    <div className="flex min-h-full w-full flex-col justify-center px-8 py-12 lg:h-full lg:px-12">
      <div className="mx-auto w-full max-w-md lg:max-w-none">
        <div className="mb-6 inline-block rounded-lg bg-white border-2 border-[#4DA3FF]/30 shadow-lg p-4">
          <h1 className="text-3xl font-semibold text-[#1F3A5F] lg:text-4xl">
            Bienvenido al Sistema de Gestión de Proyectos
          </h1>
        </div>
        <p className="mb-6 text-base text-[#6B7280] lg:text-lg flex items-start gap-2">
          <svg className="h-5 w-5 text-[#4DA3FF] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Accede a nuestra plataforma para buscar y gestionar proyectos de manera eficiente. 
          Explora información detallada sobre proyectos, zonas, categorías y períodos.
        </p>
        
        <div className="mt-8 space-y-4">
          <div className="group flex items-start gap-3 rounded-lg border border-[#E5E7EB] bg-gradient-to-r from-white to-[#4DA3FF]/5 p-4 transition-all hover:border-[#4DA3FF]/50 hover:shadow-md">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4DA3FF] to-[#1F3A5F] shadow-md">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1F3A5F] group-hover:text-[#4DA3FF] transition-colors">Búsqueda Avanzada</h3>
              <p className="text-sm text-[#6B7280]">
                Filtra proyectos por zona, categoría y período de forma intuitiva
              </p>
            </div>
          </div>
          
          <div className="group flex items-start gap-3 rounded-lg border border-[#E5E7EB] bg-gradient-to-r from-white to-[#1F3A5F]/5 p-4 transition-all hover:border-[#1F3A5F]/50 hover:shadow-md">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1F3A5F] to-[#4DA3FF] shadow-md">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1F3A5F] group-hover:text-[#4DA3FF] transition-colors">Información Detallada</h3>
              <p className="text-sm text-[#6B7280]">
                Accede a detalles completos de cada proyecto con un solo clic
              </p>
            </div>
          </div>
          
          <div className="group flex items-start gap-3 rounded-lg border border-[#E5E7EB] bg-gradient-to-r from-white to-[#4DA3FF]/5 p-4 transition-all hover:border-[#4DA3FF]/50 hover:shadow-md">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4DA3FF] to-[#F59E0B] shadow-md">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1F3A5F] group-hover:text-[#4DA3FF] transition-colors">Interfaz Intuitiva</h3>
              <p className="text-sm text-[#6B7280]">
                Diseño limpio y profesional para una experiencia de usuario óptima
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
