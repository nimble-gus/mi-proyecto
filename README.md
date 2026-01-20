# Mi Proyecto - Filtrado de Proyectos

Aplicación fullstack desarrollada con Next.js y TypeScript que permite seleccionar proyectos, filtrar por zona, categoría y período, y visualizar resultados paginados con detalles completos.

La interfaz está organizada en un diseño de **2 columnas**: un **panel lateral de filtros persistente** (sidebar izquierdo) y un **área principal** que contiene el selector de proyecto con autocomplete y el contenedor de resultados paginados. La aplicación mantiene un flujo guiado donde el proyecto es obligatorio y, una vez seleccionado, se habilitan los filtros y se cargan resultados automáticamente. Cada cambio de filtro actualiza los resultados en tiempo real.

## 🛠️ Stack Tecnológico

- **Next.js 16.1.2** - Framework React con App Router
- **TypeScript** - Tipado estático para frontend y backend
- **React 19.2.3** - Biblioteca para la interfaz de usuario
- **TailwindCSS** - Framework de CSS utility-first
- **Prisma 6.19.2** - ORM para TypeScript/Node.js
- **MySQL** - Sistema de gestión de base de datos relacional

---

## 📁 Arquitectura del Proyecto

Este proyecto sigue una **arquitectura orientada a módulos (feature-based)**, separando la lógica por dominio y centralizando elementos reutilizables. Para más detalles, consulta [`ARCHITECTURE.md`](./ARCHITECTURE.md).

```
mi-proyecto/
├── app/                          # Solo rutas, layouts y API routes (Next.js)
│   ├── page.tsx                 # Router inteligente (raíz /) - verifica autenticación y redirige
│   ├── login/
│   │   └── page.tsx             # Página de login (solo composición → AuthPage)
│   ├── search/
│   │   └── page.tsx             # Página de búsqueda (solo composición → SearchProjectsPage)
│   ├── records/
│   │   └── [id]/
│   │       └── page.tsx         # Página de detalles (solo composición → ProjectDetailsPage)
│   ├── api/                     # API Routes de Next.js
│   │   ├── projects/
│   │   │   └── route.ts         # GET /api/projects - Búsqueda por prefijo
│   │   ├── zones/
│   │   │   └── route.ts         # GET /api/zones - Catálogo de zonas
│   │   ├── categories/
│   │   │   └── route.ts         # GET /api/categories - Catálogo categorías
│   │   ├── periods/
│   │   │   └── route.ts         # GET /api/periods - Catálogo de períodos
│   │   └── records/
│   │       ├── route.ts         # GET /api/records - Resultados paginados (calcula total_unidades y unidades_disponibles)
│   │       └── [id]/
│   │           └── route.ts     # GET/PUT /api/records/[id] - Detalles y actualización
│   ├── layout.tsx              # Layout raíz con tipografía Inter
│   └── globals.css             # Estilos globales y paleta de colores
│
├── src/
│   ├── features/                # Módulos por dominio
│   │   ├── projects/            # Módulo de Proyectos
│   │   │   ├── components/      # ProjectAutocomplete, FiltersBar, ResultItem, ResultsList
│   │   │   ├── hooks/           # useProjectAutocomplete, useCatalogs, useRecordsSearch, useRecordDetails, useUpdateRecord
│   │   │   ├── api/             # projects.api.ts, catalogs.api.ts, records.api.ts
│   │   │   ├── types/           # domain.ts (Project, SelectedProject, RecordDetails)
│   │   │   └── pages/           # SearchProjectsPage, ProjectDetailsPage
│   │   ├── units/               # Módulo de Unidades (preparado, vacío)
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api/
│   │   │   └── types/
│   │   └── auth/                 # Módulo de Autenticación
│   │       ├── components/      # AuthCard, AuthIntro, AuthTabs, LoginForm, RegisterForm
│   │       ├── hooks/           # useAuth
│   │       ├── api/
│   │       ├── types/
│   │       └── pages/           # AuthPage
│   │
│   └── shared/                  # Elementos transversales reutilizables
│       ├── components/          # Componentes UI genéricos
│       │   ├── data/            # Pagination, ResultsPanel
│       │   ├── forms/           # TextInput, PasswordInput, PrimaryButton
│       │   ├── feedback/        # LoadingState, ErrorState, EmptyState
│       │   └── details/         # RecordDetailsContent
│       ├── hooks/               # Hooks genéricos (si los hay)
│       ├── lib/                 # Utilidades de biblioteca
│       │   └── prisma.ts        # PrismaClient singleton
│       ├── types/               # Tipos compartidos
│       │   └── api.ts           # Tipos de respuestas de API
│       └── utils/               # Utilidades generales
│           └── formatters.ts    # Funciones de formateo
│
├── generated/
│   └── prisma/                  # Cliente de Prisma generado
├── prisma/
│   └── schema.prisma            # Schema de Prisma (36 modelos desde MySQL)
├── .env                         # Variables de entorno (DATABASE_URL)
└── README.md
```

### Reglas de Organización

1. **`app/` solo contiene rutas, layouts y API routes**
   - Las páginas (`app/**/page.tsx`) solo importan y renderizan componentes de páginas desde `src/features/*/pages/`
   - Los layouts (`app/layout.tsx`) son layouts de Next.js
   - Los API routes (`app/api/**/route.ts`) son endpoints REST

2. **Todo lo que sea UI reusable o lógica reusable va a `src/shared/`**
   - Componentes genéricos → `src/shared/components/`
   - Hooks genéricos → `src/shared/hooks/`
   - Utilidades → `src/shared/utils/`
   - Tipos compartidos → `src/shared/types/`

3. **Todo lo específico de un dominio va por módulo en `src/features/<modulo>/`**
   - Componentes específicos → `src/features/<modulo>/components/`
   - Hooks específicos → `src/features/<modulo>/hooks/`
   - API clients → `src/features/<modulo>/api/`
   - Tipos específicos → `src/features/<modulo>/types/`
   - Páginas (lógica encapsulada) → `src/features/<modulo>/pages/`

4. **Todo lo transversal va a `src/shared/`**
   - Componentes reutilizables entre módulos
   - Utilidades compartidas
   - Tipos comunes
   - Configuraciones globales

---

## 🎨 Diseño de Interfaz

### Paleta de Colores

**Colores Principales:**
- **Primary**: Azul petróleo (#1F3A5F) - Botones principales, títulos, acciones destacadas
- **Secondary**: Azul claro (#4DA3FF) - Links, hover states, focus rings, acentos interactivos
- **Surface**: Blanco (#FFFFFF) - Fondos principales
- **Muted**: Gris claro (#F3F4F6) - Fondos de sidebar, estados disabled, hover suave
- **Text**: Gris oscuro (#111827) - Texto principal
- **Text Muted**: Gris medio (#6B7280) - Texto secundario
- **Border**: Gris suave (#E5E7EB) - Bordes y separadores

**Colores Adicionales:**
- **Success**: Verde (#10B981) - Estados positivos, unidades disponibles, badges informativos
- **Error**: Rojo (#EF4444) - Mensajes de error, validaciones
- **Accent**: Naranja (#F59E0B) - Acentos secundarios, períodos, elementos destacados

**Gradientes Utilizados:**
- `from-[#4DA3FF] to-[#1F3A5F]` - Botones principales, badges, tabs activos
- `from-[#4DA3FF] via-[#1F3A5F] to-[#4DA3FF]` - Botones con efecto hover animado
- Fondos sutiles: `from-white to-[#F3F4F6]/30` - Cards y contenedores

### Tipografía

- **Primaria**: Inter (Google Fonts)
- **Títulos**: Semibold (600)
- **Subtítulos**: Medium (500)
- **Body**: Regular (400)
- **Labels**: Semibold/Medium (para filtros, inputs y elementos interactivos)

### Elementos Visuales

**Bordes y Sombras:**
- Bordes principales: 2px para inputs, selects y elementos interactivos
- Sombras sutiles: `shadow-sm`, `shadow-md`, `shadow-lg` para profundidad
- Sombras de color: `shadow-[#4DA3FF]/10` y `ring-1 ring-[#4DA3FF]/10` para elementos destacados

**Iconos SVG:**
- Iconos informativos en headers y secciones
- Iconos de acción en botones (buscar, limpiar, navegar)
- Iconos de estado (loading, error, éxito)
- Colores dinámicos que cambian según el contexto

**Badges y Etiquetas:**
- Badges con gradientes para contadores y estados
- Badges de color por categoría de información:
  - Azul (#4DA3FF): Categorías y elementos primarios
  - Azul petróleo (#1F3A5F): Zonas y elementos secundarios
  - Naranja (#F59E0B): Períodos y elementos temporales
  - Verde (#10B981): Unidades y estados positivos

**Efectos Interactivos:**
- Hover: Transiciones suaves de color, escala y sombra
- Focus: Rings de color azul claro (`ring-2 ring-[#4DA3FF]/30`)
- Active: Estados de botones con gradientes animados
- Disabled: Opacidad reducida y cursor not-allowed

**Utilidades CSS (globals.css):**
- `.bg-size-200` - Tamaño de fondo 200% para gradientes animados
- `.bg-pos-0` / `.bg-pos-100` - Posiciones de gradiente para animaciones hover

### Layout de Router Raíz (`/`)

- **Router Inteligente**: Verifica autenticación y redirige automáticamente
  - Si está autenticado: redirige a `/search`
  - Si no está autenticado: redirige a `/login`
- **Estado de Carga**: Muestra spinner mientras verifica la sesión

### Layout de Autenticación (`/login`)

- **2 Columnas (Desktop)**:
  - Izquierda (50%): Panel informativo (`AuthIntro`) - contenido estático con título destacado, cards con iconos y gradientes
  - Derecha (50%): Formulario de autenticación (`AuthCard`) - contenido interactivo con tabs coloridos
  
- **1 Columna (Mobile)**:
  - Formulario arriba
  - Panel informativo abajo

- **Full Screen**: Cubre toda la altura de la pantalla (min-h-screen / h-screen)

**Elementos Visuales:**
- Título principal en caja blanca con borde azul y sombra
- Tabs Login/Register con gradiente azul cuando están activos
- Inputs con bordes gruesos (2px) y efectos hover/focus en azul
- Botón principal con gradiente animado y efecto scale en hover
- Cards informativas con iconos de gradiente y efectos hover

### Layout de Búsqueda (`/search`)

- **Sidebar Izquierdo (Persistente)**:
  - Panel de filtros siempre visible con título destacado y borde inferior
  - Filtros: Zona, Categoría, Período con iconos SVG en labels
  - Selects con bordes gruesos (2px) y efectos hover/focus azul claro
  - Botón "Limpiar filtros" con gradiente azul y efecto hover
  - En mobile: se muestra arriba (stack vertical)

- **Área Principal (Derecha)**:
  - Header con gradiente sutil de fondo, título con gradiente de texto e icono
  - Selector de proyecto con autocomplete (bordes 2px, hover azul, botón limpiar con color)
  - Header de resultados con icono y badge de contador con gradiente
  - Items de resultado con:
    - Gradiente sutil de fondo
    - Badges de color por categoría de información
    - Botón "Ver detalles" con gradiente azul y efecto hover
  - Paginación con contenedor con gradiente, botones con iconos y estado activo destacado
  - Mensajes de estado (sin proyecto, cargando, sin resultados) con iconos y fondos con gradiente

### Layout de Detalles (`/records/[id]`)

- **Header Sticky**:
  - Fondo con gradiente sutil y backdrop blur
  - Botón "Volver" con estilo azul claro y efecto hover
  - Título "Detalles del Proyecto" con gradiente de texto
  - Botón "Editar" con gradiente azul y efecto scale en hover

- **Contenido**:
  - Contenedor principal con gradiente sutil y sombra
  - Grid responsive (2 columnas desktop / 1 móvil) organizado en secciones:
    - **Información Básica**: Fondo azul claro sutil, icono de documento
    - **Ubicación**: Fondo azul petróleo sutil, icono de ubicación
    - **Desarrollador**: Fondo naranja sutil, icono de edificio
    - **Fechas**: Fondo verde sutil, icono de calendario
    - **Unidades**: Fondo verde sutil, icono de casa
    - **Precios**: Fondo naranja sutil, icono de dinero
    - **Información Adicional**: Fondo azul claro sutil, icono de información
  - Cada sección tiene borde, sombra sutil y título con icono y borde inferior colorido
  - Labels en semibold azul petróleo, valores con colores según importancia

- **Imagen del Proyecto**:
  - Contenedor con gradiente sutil y borde
  - Header con icono de imagen y borde inferior azul
  - Al final de la página (si está disponible)

- **Footer Sticky**:
  - Fondo con gradiente sutil y backdrop blur
  - Botón "Guardar" centrado con gradiente animado y efectos hover

### Responsive Design

- **Desktop (≥1024px)**: Layouts completos con sidebar sticky, grid de 2 columnas
- **Mobile (<1024px)**: Stack vertical, una columna, elementos apilados

---

## 📦 Módulo 0: Autenticación

Este módulo maneja el inicio de sesión y registro de usuarios. La estructura está organizada con un router inteligente en la raíz (`/`) que verifica la autenticación y redirige a la página de login (`/login`) o a la búsqueda (`/search`) según corresponda.

### 0.1. Estructura de Rutas de Autenticación

```
Usuario visita http://localhost:3000/
    ↓
Router Inteligente (app/page.tsx)
    ↓
Verifica localStorage.getItem("auth_session")
    ↓
¿Está autenticado?
    ├─ Sí → Redirige a /search
    └─ No → Redirige a /login
        ↓
Página de Login (app/login/page.tsx)
    ↓
Layout de 2 columnas:
  - Izquierda: Panel informativo (AuthIntro)
  - Derecha: Formulario de autenticación (AuthCard)
    ↓
Usuario hace click en "Ingresar" o "Registrarse"
    ↓
useAuth.login() / useAuth.register()
    ↓
localStorage.setItem("auth_session", ...)
    ↓
Redirección automática a /search (página de búsqueda)
```

**Componentes involucrados:**
- `app/page.tsx` - Router inteligente (raíz `/`) - verifica autenticación y redirige
- `app/login/page.tsx` - Página de login (`/login`) - formulario completo de autenticación
- `AuthIntro` - Panel izquierdo con información del sistema
- `AuthCard` - Contenedor del formulario de autenticación
- `AuthTabs` - Tabs para alternar entre Login y Register
- `LoginForm` - Formulario de inicio de sesión
- `RegisterForm` - Formulario de registro
- `TextInput` - Input de texto reutilizable
- `PasswordInput` - Input de contraseña con toggle mostrar/ocultar
- `PrimaryButton` - Botón principal con estados de loading

**Características:**
- Router inteligente en la raíz que verifica autenticación automáticamente
- Layout responsivo: 2 columnas en desktop, apilado en mobile
- Formularios con validación básica
- Estados de loading durante el proceso
- Manejo de errores con mensajes claros
- Por el momento: sin validación real, solo estructura y redirección
- Redirección automática a `/search` después de login/registro exitoso

**Hook de autenticación:**
- `useAuth` - Maneja login y register, redirección automática
- Actualmente simula autenticación (preparado para conectar con API real)
- Guarda sesión en localStorage (desarrollo)

### 0.2. Flujo de Datos del Módulo 0

```
Usuario visita /
    ↓
RootPage (app/page.tsx)
    ↓
Verifica localStorage.getItem("auth_session")
    ↓
¿Existe sesión?
    ├─ Sí → router.push("/search")
    └─ No → router.push("/login")
        ↓
LoginPage (app/login/page.tsx)
    ↓ (usa hook)
useAuth.login() / useAuth.register()
    ↓ (simulación)
localStorage.setItem("auth_session", ...)
    ↓ (redirección)
router.push("/search")
    ↓
Página de Búsqueda
```

---

## 📦 Módulo 1: Búsqueda y Filtros

Este módulo maneja la búsqueda de proyectos, selección del proyecto y aplicación de filtros (zona, categoría, período). El flujo es guiado donde el proyecto es obligatorio y los filtros se habilitan automáticamente una vez seleccionado el proyecto.

### 1.1. Búsqueda y Selección de Proyecto

```
Usuario escribe en el input
    ↓
Debounce (300ms)
    ↓
GET /api/projects?q=prefijo
    ↓
Muestra hasta 50 proyectos únicos (sin duplicados)
    ↓
Usuario selecciona un proyecto
    ↓
Se habilita sidebar de filtros
    ↓
Se carga automáticamente:
  - GET /api/zones?project=...
  - GET /api/categories?project=...
  - GET /api/periods?project=...
    ↓
Búsqueda automática de resultados (page=1)
```

**Componentes involucrados:**
- `app/search/page.tsx` - Página principal de búsqueda
- `ProjectAutocomplete` - Input con dropdown (área principal, arriba)
- `useProjectAutocomplete` - Hook con debounce y búsqueda

**Características:**
- Búsqueda por prefijo (`startsWith`)
- Debounce de 300ms para optimizar peticiones
- Eliminación automática de duplicados (máx 50 únicos)
- Visualización inteligente: muestra primeras palabras si hay duplicados
- Límite de caracteres: 200 caracteres en el input

### 1.2. Aplicación de Filtros (Automática)

```
Proyecto seleccionado
    ↓
Filtros habilitados en sidebar (zona, categoría y período)
    ↓
Usuario selecciona filtros (opcional)
    ↓
Búsqueda automática inmediata (sin botón)
    ↓
GET /api/records?project=...&zone=...&category=...&period=...&page=1&pageSize=5
```

**Componentes involucrados:**
- `FiltersBar` - Sidebar persistente con selectores de zona, categoría y período
- `useCatalogs` - Hook que carga catálogos dinámicos (zonas, categorías, períodos)
- `useRecordsSearch` - Hook que ejecuta búsqueda automática cuando cambian filtros o proyecto

**Características:**
- Sidebar persistente siempre visible
- Filtros deshabilitados hasta seleccionar proyecto
- Catálogos dinámicos cargados en paralelo (zonas, categorías, períodos)
- Búsqueda automática al cambiar cualquier filtro
- Reset automático a página 1 al cambiar filtros
- Botón "Limpiar filtros" cuando hay filtros activos

### 1.3. Flujo de Datos del Módulo 1

**Búsqueda de Proyectos:**
```
page.tsx
  ↓ (usa hook)
useProjectAutocomplete
  ↓ (llama API)
projects.api.ts.searchProjects()
  ↓ (fetch)
GET /api/projects?q=...
  ↓ (consulta DB)
Prisma.housing_universe.findMany({ startsWith })
  ↓ (respuesta)
projects.api.ts → useProjectAutocomplete → page.tsx → ProjectAutocomplete
```

**Carga de Catálogos:**
```
page.tsx (selectedProject cambia)
  ↓ (usa hook)
useCatalogs
  ↓ (llama APIs en paralelo)
Promise.all([
  catalogs.api.ts.getZones(),
  catalogs.api.ts.getCategories(),
  catalogs.api.ts.getPeriods()
])
  ↓ (fetch paralelo)
GET /api/zones?project=...
GET /api/categories?project=...
GET /api/periods?project=...
  ↓ (consulta DB)
Prisma.housing_universe.findMany({ distinct })
  ↓ (respuesta)
useCatalogs → page.tsx → FiltersBar
```

**Búsqueda Automática de Resultados:**
```
page.tsx (proyecto o filtro cambia)
  ↓ (trigger automático)
useRecordsSearch.useEffect()
  ↓ (detecta cambios)
useRecordsSearch.performSearch()
  ↓ (llama API)
records.api.ts.searchRecords()
  ↓ (fetch)
GET /api/records?project=...&zone=...&category=...&period=...&page=1&pageSize=5
  ↓ (consulta DB con paginación)
Prisma.housing_universe.count({ where })
Prisma.housing_universe.findMany({ skip, take, select: id, proyecto, categoria, zona, periodo })
  ↓ (calcula total_unidades y unidades_disponibles dinámicamente)
Para cada registro: Prisma.housing_units.count({ proyecto, periodo })
Para cada registro: Prisma.housing_units.count({ proyecto, periodo, disponibilidad: "Disponible" })
  ↓ (respuesta con campos calculados)
records.api.ts → useRecordsSearch → page.tsx → [Módulo 2]
```

---

## 📦 Módulo 2: Visualización de Resultados

Este módulo maneja la visualización de resultados paginados, navegación entre páginas y visualización de detalles completos en una página dedicada de detalles/edición (`/records/[id]`). Los resultados se muestran automáticamente después de que el Módulo 1 ejecuta la búsqueda.

### 2.1. Visualización de Resultados Paginados

```
Búsqueda automática ejecutada (desde Módulo 1)
    ↓
Muestra 5 resultados por página
    ↓
Cada resultado muestra:
  - Proyecto
  - Categoría
  - Zona (si existe)
  - Período
  - Total Unidades (calculado desde housing_units, muestra 0 si es null)
  - Unidades Disponibles (calculado desde housing_units donde disponibilidad="Disponible", muestra 0 si es null)
    ↓
Información de paginación:
  - "Mostrando X - Y de Z resultados"
  - "Página X de Y"
  - Botones Anterior/Siguiente
    ↓
Usuario navega entre páginas
    ↓
Búsqueda automática con nueva página (mantiene filtros)
```

**Componentes involucrados:**
- `ResultsList` - Contenedor principal de resultados (área principal, parte inferior)
- `ResultItem` - Item individual (muestra proyecto, categoría, zona, período, total unidades, unidades disponibles)
- `Pagination` - Navegación de páginas (siempre presente si hay páginas)
- `useRecordsSearch` - Hook con búsqueda automática y lógica de paginación

**Características:**
- 5 resultados por página (configurable, máx 50)
- Estados de UI: cargando, error, sin resultados, con resultados
- Paginación siempre visible si hay múltiples páginas
- Navegación automática: búsqueda al cambiar página
- Contador de resultados: "X resultados" / "X - Y de Z resultados"

### 2.2. Visualización de Detalles Completos

```
Usuario hace click en "Ver detalles" en un ResultItem
    ↓
Navegación a /records/[id]
    ↓
Verifica cache (Map<id, details>)
    ↓
Si no está en cache:
  GET /api/records/[id]
    ↓
Guarda en cache
    ↓
Muestra página de detalles con campos específicos:
  - Información Básica (proyecto, fase, torre, período, categoría, estado)
  - Ubicación (país, departamento, municipio, zona)
  - Desarrollador
  - Fechas (fecha inicio, fecha entrega)
  - Unidades (total unidades, unidades disponibles)
  - Precios (precio promedio, cuota promedio, ingresos promedio)
  - Información Adicional (tipo de seguridad, cantidad accesos, URL imagen)
```

**Componentes involucrados:**
- `app/records/[id]/page.tsx` - Página de detalles del proyecto
- `RecordDetailsContent` - Contenido de detalles organizados en secciones
- `useRecordDetails` - Hook con cache y carga de detalles
- `ResultItem` - Link "Ver detalles" que navega a la página

**Características:**
- Cache de detalles para evitar peticiones redundantes
- Página dedicada responsive con layout completo
- Header sticky con botón "Volver", título y botón "Editar"
- Footer sticky con botón "Guardar"
- Organización lógica de campos en secciones (Grid 2 columnas desktop / 1 móvil)
- Formateo de valores (fechas, números, enlaces) - funciones en `src/shared/utils/formatters.ts`
- Manejo de valores null/undefined (muestra 0 o N/A según corresponda)
- Imagen del proyecto al final de la página (si `url_imagen` está disponible)
- Navegación nativa de Next.js (mejor UX que modal)

### 2.3. Flujo de Datos del Módulo 2

**Visualización de Resultados:**
```
useRecordsSearch (datos desde Módulo 1)
  ↓ (pasa items)
page.tsx
  ↓ (renderiza)
ResultsList
  ↓ (renderiza cada item)
ResultItem
  ↓ (muestra)
- Proyecto
- Categoría
- Zona (si existe)
- Período
- Total Unidades (calculado desde housing_units)
- Unidades Disponibles (calculado desde housing_units donde disponibilidad="Disponible")
```

**Navegación de Páginas:**
```
Pagination (click en Anterior/Siguiente)
  ↓ (callback)
page.tsx (onPreviousPage/onNextPage)
  ↓ (actualiza estado)
useRecordsSearch.setPage(newPage)
  ↓ (ejecuta búsqueda automática)
useRecordsSearch.performSearch(newPage)
  ↓ (mismo flujo que búsqueda inicial)
GET /api/records?...&page=newPage&pageSize=5
  ↓ (nuevos resultados)
ResultsList → ResultItem
```

**Detalles de la Página:**
```
ResultItem (click en "Ver detalles")
  ↓ (Link component)
Navegación a /records/[id]
  ↓ (página carga)
app/records/[id]/page.tsx
  ↓ (usa hook)
useRecordDetails.loadDetails(id)
  ↓ (verifica cache)
detailsCache.has(id) ?
  → Sí: usa datos del cache
  → No: records.api.ts.getRecordDetails(id)
        ↓ (fetch)
        GET /api/records/[id]
        ↓ (consulta DB con select específico)
        Prisma.housing_universe.findUnique({ 
          where: { id },
          select: { proyecto, fase, torre, ... }
        })
        ↓ (guarda en cache)
        detailsCache.set(id, data)
  ↓ (renderiza página)
RecordDetailsContent + Imagen
```

### 2.4. Campos Mostrados en Resultados

**Cada `ResultItem` muestra:**
- **Proyecto**: Nombre del proyecto
- **Categoría**: Categoría del registro
- **Zona**: Zona del registro (solo si existe)
- **Período**: Período del registro
- **Total Unidades**: Total de unidades calculado dinámicamente desde `housing_units` basándose en `proyecto` y `periodo` (muestra 0 si es null o undefined)
- **Unidades Disponibles**: Unidades disponibles calculadas dinámicamente desde `housing_units` donde `disponibilidad = "Disponible"` (muestra 0 si es null o undefined)
- **Botón "Ver detalles"**: Navega a `/records/[id]` con información completa y modo de edición

**La página `/records/[id]` muestra (solo campos necesarios):**
- **Información Básica**: Proyecto, Fase, Torre, Período, Categoría, Estado
- **Ubicación**: País, Departamento, Municipio, Zona, Latitud, Longitud
- **Desarrollador**: Nombre del desarrollador
- **Fechas**: Fecha Inicio, Fecha Entrega (como strings `YYYY-MM-DD`)
- **Unidades**: Total Unidades (solo lectura), Unidades Disponibles (editable)
- **Precios**: Precio Promedio, Cuota Promedio, Ingresos Promedio (editables)
- **Información Adicional**: Tipo de Seguridad, Cantidad Accesos, URL Imagen (link clickeable)

---

## 🏗️ Arquitectura por Capas

### Capa de Presentación (UI)

**Módulo de Autenticación (`src/features/auth/`):**
- **`AuthPage`** - Página completa de autenticación (lógica encapsulada)
- **`AuthIntro`** - Panel izquierdo informativo (solo lectura)
- **`AuthCard`** - Contenedor del formulario de autenticación
- **`AuthTabs`** - Tabs para alternar entre Login y Register
- **`LoginForm`** - Formulario de inicio de sesión
- **`RegisterForm`** - Formulario de registro con validación

**Módulo de Proyectos (`src/features/projects/`):**
- **`SearchProjectsPage`** - Página completa de búsqueda (lógica encapsulada)
- **`ProjectDetailsPage`** - Página completa de detalles (lógica encapsulada)
- **`ProjectAutocomplete`** - Input y dropdown con búsqueda en tiempo real
- **`FiltersBar`** - Sidebar persistente con selectores de filtros (zona, categoría y período)
- **`ResultsList`** - Contenedor principal de resultados con estados de carga/error
- **`ResultItem`** - Item individual que muestra: proyecto, categoría, zona, período, total unidades, unidades disponibles

**Componentes Compartidos (`src/shared/components/`):**
- **`Pagination`** - Navegación entre páginas con información de resultados
- **`ResultsPanel`** - Panel genérico de resultados (loading, error, empty, lista, paginación)
- **`TextInput`** - Input de texto reutilizable con validación
- **`PasswordInput`** - Input de contraseña con toggle mostrar/ocultar
- **`PrimaryButton`** - Botón principal con estados de loading
- **`LoadingState`** - Estado de carga genérico
- **`ErrorState`** - Estado de error genérico
- **`EmptyState`** - Estado vacío genérico
- **`RecordDetailsContent`** - Contenido de detalles organizados en secciones (reutilizable)

### Capa de Lógica (Hooks)

**Módulo de Autenticación (`src/features/auth/hooks/`):**
- **`useAuth`** - Manejo de login y register, redirección automática, estados de loading/error

**Módulo de Proyectos (`src/features/projects/hooks/`):**
- **`useProjectAutocomplete`** - Búsqueda con debounce (300ms), gestión de estado del autocomplete, eliminación de duplicados (máx 50 únicos)
- **`useCatalogs`** - Carga automática de catálogos cuando cambia el proyecto (zonas, categorías y períodos en paralelo)
- **`useRecordsSearch`** - Búsqueda paginada automática (5 por página), se ejecuta automáticamente cuando cambian proyecto o filtros (zona, categoría, período), gestión de página y resultados
- **`useRecordDetails`** - Cache de detalles (useRef con Map), carga de datos desde API
- **`useUpdateRecord`** - Actualización de registro con manejo de estados

**Hooks Compartidos (`src/shared/hooks/`):**
- (Preparado para hooks genéricos reutilizables)

### Capa de Servicios (API Functions)

**Módulo de Proyectos (`src/features/projects/api/`):**
- **`projects.api.ts`** - `searchProjects(query: string)` - Búsqueda por prefijo
- **`catalogs.api.ts`** - `getZones(project: string)`, `getCategories(project: string)`, `getPeriods(project: string)` - Catálogos dinámicos
- **`records.api.ts`** - `searchRecords(params)`, `getRecordDetails(id: number)`, `updateRecordDetails(id, data)` - Registros y detalles (soporta filtros: zone, category, period)

### Capa de Utilidades

**Utilidades Compartidas (`src/shared/utils/`):**
- **`formatters.ts`** - `formatValue(value)`, `formatDate(dateString)` - Formateo de valores y fechas para visualización consistente

**Bibliotecas Compartidas (`src/shared/lib/`):**
- **`prisma.ts`** - PrismaClient singleton (previene múltiples instancias en desarrollo)

### Capa de Backend (API Routes)
**Ubicación:** `app/api/`

Endpoints REST que procesan requests y consultan la base de datos:

- **`/api/projects`** - Búsqueda por prefijo (máx 50 únicos, sin duplicados)
- **`/api/zones`** - Catálogo de zonas únicas por proyecto (ordenadas A-Z)
- **`/api/categories`** - Catálogo de categorías únicas por proyecto (ordenadas A-Z)
- **`/api/periods`** - Catálogo de períodos únicos por proyecto (ordenados A-Z)
- **`/api/records`** - Resultados filtrados y paginados (5 por página, campos: id, proyecto, categoria, zona, periodo, total_unidades, unidades_disponibles. Calcula dinámicamente total_unidades y unidades_disponibles desde housing_units basándose en proyecto y periodo. Filtros: zone, category, period)
  - **Cálculo dinámico**: Para cada registro de `housing_universe`, el endpoint ejecuta dos consultas en paralelo a `housing_units`:
    - `total_unidades`: Cuenta todas las unidades donde `proyecto` y `periodo` coinciden
    - `unidades_disponibles`: Cuenta las unidades donde `proyecto`, `periodo` y `disponibilidad = "Disponible"` coinciden
    - Ambos valores se calculan usando `Promise.all` para optimizar el rendimiento
    - Si el conteo es 0 o null, se devuelve 0 en lugar de null
- **`/api/records/[id]`** - Detalles específicos de un registro (solo campos necesarios: proyecto, fase, torre, periodo, categoria, pais, departamento, municipio, zona, desarrollador, estado, fecha_inicio, fecha_entrega, total_unidades, unidades_disponibles, tipo_de_seguridad, precio_promedio, cuota_promedio, ingresos_promedio, cantidad_accesos, url_imagen)

### Capa de Datos
**Ubicación:** `prisma/`, `src/shared/lib/prisma.ts`

- **`schema.prisma`** - Definición de modelos (36 modelos importados desde MySQL)
- **`prisma.ts`** - Singleton de PrismaClient (previene múltiples instancias en desarrollo)
- **`generated/prisma/`** - Cliente generado por Prisma

### Capa de Tipos

**Tipos de Dominio (`src/features/projects/types/`):**
- **`domain.ts`** - Tipos del dominio de negocio:
  - `Project` - { id, proyecto, categoria, zona, periodo, total_unidades, unidades_disponibles }
  - `SelectedProject` - { proyecto, categoria, zona }
  - `RecordDetails` - Campos específicos de la página de detalles (proyecto, fase, torre, periodo, categoria, pais, departamento, municipio, zona, desarrollador, estado, fecha_inicio, fecha_entrega, total_unidades, unidades_disponibles, tipo_de_seguridad, precio_promedio, cuota_promedio, ingresos_promedio, cantidad_accesos, url_imagen, latitud, longitud)

**Tipos Compartidos (`src/shared/types/`):**
- **`api.ts`** - Tipos de respuestas de la API:
  - `ProjectsResponse`, `ZonesResponse`, `CategoriesResponse`, `PeriodsResponse`
  - `RecordsResponse`, `DetailsResponse`

---

## 🔀 Flujo de Datos Completo

### Flujo de Búsqueda de Proyectos

```
page.tsx
  ↓ (usa hook)
useProjectAutocomplete
  ↓ (llama API)
projects.api.ts.searchProjects()
  ↓ (fetch)
GET /api/projects?q=...
  ↓ (consulta DB)
Prisma.housing_universe.findMany({ startsWith })
  ↓ (respuesta)
projects.api.ts → useProjectAutocomplete → page.tsx → ProjectAutocomplete
```

### Flujo de Carga de Catálogos

```
page.tsx (selectedProject cambia)
  ↓ (usa hook)
useCatalogs
  ↓ (llama APIs en paralelo)
Promise.all([
  catalogs.api.ts.getZones(),
  catalogs.api.ts.getCategories(),
  catalogs.api.ts.getPeriods()
])
  ↓ (fetch paralelo)
GET /api/zones?project=...
GET /api/categories?project=...
GET /api/periods?project=...
  ↓ (consulta DB)
Prisma.housing_universe.findMany({ distinct })
  ↓ (respuesta)
useCatalogs → page.tsx → FiltersBar
```

### Flujo de Detalles de la Página (Módulo 2)

```
ResultItem (click en "Ver detalles")
  ↓ (Link component)
Navegación a /records/[id]
  ↓ (página carga)
app/records/[id]/page.tsx
  ↓ (usa hook)
useRecordDetails.loadDetails(id)
  ↓ (verifica cache)
detailsCache.has(id) ?
  → Sí: usa datos del cache
  → No: records.api.ts.getRecordDetails(id)
        ↓ (fetch)
        GET /api/records/[id]
        ↓ (consulta DB)
        Prisma.housing_universe.findUnique({ where: { id } })
        ↓ (guarda en cache)
        detailsCache.set(id, data)
  ↓ (renderiza página)
ProjectDetailsPage → RecordDetailsContent
```

---

## 📊 Diagrama de Flujo Completo

### Módulo 1: Búsqueda y Filtros

```
┌─────────────────────────────────────────────────────────────┐
│                    Usuario en Frontend                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   ProjectAutocomplete             │
        │   (Escribe para buscar)          │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   useProjectAutocomplete          │
        │   (Debounce 300ms)                │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   GET /api/projects?q=...         │
        │   (Máx 50 proyectos únicos)      │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   Usuario selecciona proyecto     │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   useCatalogs                     │
        │   (Carga automática)              │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   GET /api/zones?project=...      │
        │   GET /api/categories?project=... │
        │   GET /api/periods?project=...    │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   FiltersBar (Sidebar)            │
        │   (Usuario selecciona filtros:   │
        │    zona, categoría, período)     │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   Búsqueda automática             │
        │   (useEffect detecta cambios)     │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   useRecordsSearch.performSearch()│
        │   (Automático, sin botón)         │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   GET /api/records?...&zone=...    │
        │   &category=...&period=...         │
        │   &page=1&pageSize=5                │
        └───────────────────────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  MÓDULO 2     │
                    │  Resultados   │
                    └───────────────┘
```

### Módulo 2: Visualización de Resultados

```
                    ┌───────────────┐
                    │  MÓDULO 1     │
                    │  Búsqueda     │
                    └───────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   ResultsList                     │
        │   (Muestra 5 resultados)          │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   ResultItem                      │
        │   (proyecto, categoría, zona,     │
        │    período, total unidades,       │
        │    unidades disponibles)          │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   Pagination                      │
        │   (Navegación entre páginas)      │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   ResultItem                      │
        │   (Click en "Ver detalles")      │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   useRecordDetails.openDetails()  │
        │   (Verifica cache)                │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   GET /api/records/[id]           │
        │   (Si no está en cache)           │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   ProjectDetailsPage              │
        │   (Página dedicada con todos los   │
        │    campos y modo edición)         │
        └───────────────────────────────────┘
```

---

## 🎯 Principios de Arquitectura

### Separación de Responsabilidades
- **Componentes UI**: Solo renderizan, no tienen lógica de negocio
- **Hooks**: Encapsulan lógica reutilizable
- **API Functions**: Abstraen llamadas HTTP
- **API Routes**: Procesan requests y consultan DB

### Reutilización
- Hooks pueden ser usados en múltiples componentes
- Funciones API centralizadas
- Componentes presentacionales reutilizables

### Escalabilidad
- Estructura modular fácil de extender
- Nuevos componentes/hooks siguen el mismo patrón
- Tipos TypeScript para seguridad

### Performance
- Debounce en búsqueda (300ms)
- Cache de detalles (Map<id, details>)
- Paginación (5 items por página)
- Lazy loading de catálogos
- Búsqueda automática reactiva (cuando cambian proyecto o filtros)
- Layout responsive con sidebar sticky en desktop
- Optimización de re-renders con hooks y callbacks

---

---

## 📝 Resumen de Campos por Módulo

### Módulo 1: Campos de Búsqueda y Filtros

**Búsqueda de Proyectos:**
- Input de búsqueda con autocomplete
- Hasta 50 proyectos únicos mostrados
- Visualización inteligente (primera palabra o hasta 5 palabras si hay duplicados)

**Filtros Disponibles:**
- **Zona**: Todas las zonas únicas del proyecto seleccionado (ordenadas A-Z)
- **Categoría**: Todas las categorías únicas del proyecto seleccionado (ordenadas A-Z)
- **Período**: Todos los períodos únicos del proyecto seleccionado (ordenados A-Z)

### Módulo 2: Campos de Resultados y Detalles

**Cada `ResultItem` muestra:**
- **Proyecto**: Nombre del proyecto
- **Categoría**: Categoría del registro
- **Zona**: Zona del registro (solo si existe)
- **Período**: Período del registro
- **Total Unidades**: Total de unidades calculado dinámicamente desde `housing_units` basándose en `proyecto` y `periodo` (muestra 0 si es null o undefined)
- **Unidades Disponibles**: Unidades disponibles calculadas dinámicamente desde `housing_units` donde `disponibilidad = "Disponible"` (muestra 0 si es null o undefined)
- **Botón "Ver detalles"**: Navega a `/records/[id]` con información completa y modo de edición

**La página `/records/[id]` muestra (solo campos necesarios):**

- **Información Básica**: Proyecto, Fase, Torre, Período, Categoría, Estado
- **Ubicación**: País, Departamento, Municipio, Zona, Latitud, Longitud
- **Desarrollador**: Nombre del desarrollador
- **Fechas**: Fecha Inicio, Fecha Entrega (formateadas)
- **Unidades**: Total Unidades (solo lectura, muestra 0 si es null), Unidades Disponibles (editable, muestra 0 si es null)
- **Precios**: Precio Promedio, Cuota Promedio, Ingresos Promedio (editables)
- **Información Adicional**: Tipo de Seguridad, Cantidad Accesos, URL Imagen (link clickeable)

---

---

## 🎯 Características Clave

### Búsqueda Automática
- **Sin botón "Buscar"**: Los resultados se actualizan automáticamente cuando:
  - Se selecciona un proyecto (resetea página a 1)
  - Se cambia cualquier filtro (zona, categoría, período) (resetea página a 1)
  - Se navega entre páginas (mantiene filtros)

### Sidebar Persistente
- **Siempre visible**: El panel de filtros está siempre disponible
- **Estados deshabilitados**: Los selects se deshabilitan hasta seleccionar un proyecto
- **Mensaje guía**: Muestra "Selecciona un proyecto para habilitar filtros" cuando no hay proyecto

### Diseño Responsive
- **Desktop**: 2 columnas con sidebar sticky izquierdo
- **Mobile**: Stack vertical con sidebar arriba
- **Breakpoint**: `lg:` (1024px+)

### Flujo Guiado
1. Usuario busca proyecto → Autocomplete con debounce
2. Usuario selecciona proyecto → Filtros habilitados + Búsqueda automática
3. Usuario cambia filtros → Búsqueda automática (página 1)
4. Usuario navega páginas → Búsqueda automática (mismo filtro, nueva página)

---

---

## 📚 Documentación Adicional

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Documentación detallada de la arquitectura feature-based
- **[API.md](./API.md)** - Documentación completa de los endpoints de la API

---

**Última actualización:** Enero 2026
