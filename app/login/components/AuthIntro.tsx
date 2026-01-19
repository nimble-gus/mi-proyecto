"use client";

export function AuthIntro() {
  return (
    <div className="flex min-h-full w-full flex-col justify-center px-8 py-12 lg:h-full lg:px-12">
      <div className="mx-auto w-full max-w-md lg:max-w-none">
        <h1 className="mb-4 text-3xl font-semibold text-[#111827] lg:text-4xl">
          Bienvenido al Sistema de Gestión de Proyectos
        </h1>
        <p className="mb-6 text-base text-[#6B7280] lg:text-lg">
          Accede a nuestra plataforma para buscar y gestionar proyectos de manera eficiente. 
          Explora información detallada sobre proyectos, zonas, categorías y períodos.
        </p>
        
        <div className="mt-8 space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4DA3FF]/10">
              <svg className="h-4 w-4 text-[#4DA3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-medium text-[#111827]">Búsqueda Avanzada</h3>
              <p className="text-sm text-[#6B7280]">
                Filtra proyectos por zona, categoría y período de forma intuitiva
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4DA3FF]/10">
              <svg className="h-4 w-4 text-[#4DA3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-medium text-[#111827]">Información Detallada</h3>
              <p className="text-sm text-[#6B7280]">
                Accede a detalles completos de cada proyecto con un solo clic
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4DA3FF]/10">
              <svg className="h-4 w-4 text-[#4DA3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-medium text-[#111827]">Interfaz Intuitiva</h3>
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
