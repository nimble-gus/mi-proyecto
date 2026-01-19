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

```
mi-proyecto/
├── app/
│   ├── page.tsx                        # Página de Login (raíz /)
│   ├── login/
│   │   ├── page.tsx                    # Componente de login (redirigido desde /)
│   │   └── components/
│   │       ├── AuthIntro.tsx           # Panel izquierdo informativo
│   │       ├── AuthCard.tsx            # Contenedor del formulario
│   │       ├── AuthTabs.tsx            # Tabs Login/Register
│   │       ├── LoginForm.tsx           # Formulario de login
│   │       ├── RegisterForm.tsx        # Formulario de registro
│   │       ├── TextInput.tsx           # Input de texto reutilizable
│   │       ├── PasswordInput.tsx       # Input de contraseña reutilizable
│   │       └── PrimaryButton.tsx       # Botón principal reutilizable
│   ├── search/
│   │   └── page.tsx                    # Página principal de búsqueda (/search)
│   ├── (ui)/
│   │   └── components/
│   │       ├── ProjectAutocomplete.tsx # Selector de proyecto con autocomplete
│   │       ├── FiltersBar.tsx          # Filtros de zona, categoría y período
│   │       ├── ResultsList.tsx         # Lista de resultados paginados
│   │       ├── ResultItem.tsx          # Item individual (proyecto, categoría, zona, período)
│   │       ├── RecordDetailsContent.tsx # Contenido de detalles reutilizable
│   │       └── Pagination.tsx          # Componente de paginación (5 por página)
│   ├── records/
│   │   └── [id]/
│   │       └── page.tsx                # Página de detalles del proyecto (/records/[id])
│   ├── api/
│   │   ├── projects/
│   │   │   └── route.ts                # GET /api/projects - Búsqueda por prefijo
│   │   ├── zones/
│   │   │   └── route.ts                # GET /api/zones - Catálogo de zonas
│   │   ├── categories/
│   │   │   └── route.ts                # GET /api/categories - Catálogo categorías
│   │   ├── periods/
│   │   │   └── route.ts                # GET /api/periods - Catálogo de períodos
│   │   └── records/
│   │       ├── route.ts                # GET /api/records - Resultados paginados
│   │       └── [id]/
│   │           └── route.ts            # GET /api/records/[id] - Detalles completos
│   ├── layout.tsx                      # Layout raíz con tipografía Inter
│   └── globals.css                     # Estilos globales y paleta de colores
├── src/
│   ├── hooks/
│   │   ├── useAuth.ts                  # Hook: autenticación (login/register)
│   │   ├── useProjectAutocomplete.ts   # Hook: autocomplete + debounce (300ms)
│   │   ├── useCatalogs.ts              # Hook: carga automática de catálogos
│   │   ├── useRecordsSearch.ts        # Hook: búsqueda paginada (5 por página)
│   │   └── useRecordDetails.ts        # Hook: detalles + cache
│   ├── lib/
│   │   ├── prisma.ts                  # PrismaClient singleton
│   │   ├── api/
│   │   │   ├── projects.api.ts         # API: searchProjects(query)
│   │   │   ├── catalogs.api.ts        # API: getZones, getCategories, getPeriods
│   │   │   └── records.api.ts         # API: searchRecords, getRecordDetails
│   │   └── utils/
│   │       └── formatters.ts           # Funciones: formatValue, formatDate
│   └── types/
│       ├── domain.ts                  # Tipos: Project, SelectedProject, RecordDetails
│       └── api.ts                     # Tipos: respuestas de API
├── generated/
│   └── prisma/                        # Cliente de Prisma generado
├── prisma/
│   └── schema.prisma                  # Schema de Prisma (36 modelos desde MySQL)
├── .env                               # Variables de entorno (DATABASE_URL)
└── README.md
```

---

## 🎨 Diseño de Interfaz

### Paleta de Colores

- **Primary**: Azul petróleo (#1F3A5F) - Botones principales, acciones destacadas
- **Secondary**: Azul claro (#4DA3FF) - Links, hover states, focus rings
- **Surface**: Blanco (#FFFFFF) - Fondos principales
- **Muted**: Gris claro (#F3F4F6) - Fondos de sidebar, estados disabled, hover suave
- **Text**: Gris oscuro (#111827) - Texto principal
- **Border**: Gris suave (#E5E7EB) - Bordes y separadores
- **Success/Error**: Verde/Rojo sobrios para mensajes

### Tipografía

- **Primaria**: Inter (Google Fonts)
- **Títulos**: Semibold
- **Body**: Regular
- **Labels**: Medium (para filtros e inputs)

### Layout de Autenticación (`/`)

- **2 Columnas (Desktop)**:
  - Izquierda (50%): Panel informativo (`AuthIntro`) - contenido estático
  - Derecha (50%): Formulario de autenticación (`AuthCard`) - contenido interactivo
  
- **1 Columna (Mobile)**:
  - Formulario arriba
  - Panel informativo abajo

- **Full Screen**: Cubre toda la altura de la pantalla (min-h-screen / h-screen)

### Layout de Búsqueda (`/search`)

- **Sidebar Izquierdo (Persistente)**:
  - Panel de filtros siempre visible (fondo gris claro #F3F4F6)
  - Filtros: Zona, Categoría, Período
  - Selects deshabilitados hasta que se seleccione un proyecto
  - Botón "Limpiar filtros" como link secundario cuando hay filtros activos
  - En mobile: se muestra arriba (stack vertical)

- **Área Principal (Derecha)**:
  - Selector de proyecto con autocomplete (arriba)
  - Contenedor de resultados paginados (abajo)
  - Mensajes de estado (sin proyecto, cargando, sin resultados)

### Layout de Detalles (`/records/[id]`)

- **Header Sticky**: Botón "Volver", título "Detalles del Proyecto", botón "Editar"
- **Contenido**: Grid responsive (2 columnas desktop / 1 móvil) organizado en secciones
- **Imagen del Proyecto**: Al final de la página (si está disponible)
- **Footer Sticky**: Botón "Guardar" centrado

### Responsive Design

- **Desktop (≥1024px)**: Layouts completos con sidebar sticky, grid de 2 columnas
- **Mobile (<1024px)**: Stack vertical, una columna, elementos apilados

---

## 📦 Módulo 0: Autenticación

Este módulo maneja el inicio de sesión y registro de usuarios. La página de login está en la raíz (`/`) y es independiente del layout principal del sistema de búsqueda.

### 0.1. Estructura de Rutas de Autenticación

```
Usuario visita http://localhost:3000/
    ↓
Página de Login (app/page.tsx)
    ↓
Layout de 2 columnas:
  - Izquierda: Panel informativo (AuthIntro)
  - Derecha: Formulario de autenticación (AuthCard)
    ↓
Usuario hace click en "Ingresar" o "Registrarse"
    ↓
Redirección automática a /search (página de búsqueda)
```

**Componentes involucrados:**
- `app/page.tsx` - Página principal de login (raíz)
- `AuthIntro` - Panel izquierdo con información del sistema
- `AuthCard` - Contenedor del formulario de autenticación
- `AuthTabs` - Tabs para alternar entre Login y Register
- `LoginForm` - Formulario de inicio de sesión
- `RegisterForm` - Formulario de registro
- `TextInput` - Input de texto reutilizable
- `PasswordInput` - Input de contraseña con toggle mostrar/ocultar
- `PrimaryButton` - Botón principal con estados de loading

**Características:**
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
LoginPage
  ↓ (usa hook)
useAuth.login()
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
Prisma.housing_universe.findMany({ skip, take })
  ↓ (respuesta)
records.api.ts → useRecordsSearch → page.tsx → [Módulo 2]
```

---

## 📦 Módulo 2: Visualización de Resultados

Este módulo maneja la visualización de resultados paginados, navegación entre páginas y visualización de detalles completos en un modal. Los resultados se muestran automáticamente después de que el Módulo 1 ejecuta la búsqueda.

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
  - Total Unidades (muestra 0 si es null)
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
- `ResultItem` - Item individual (muestra proyecto, categoría, zona, período, total unidades)
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
- Formateo de valores (fechas, números, enlaces) - funciones en `src/lib/utils/formatters.ts`
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
- Total Unidades
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
- **Total Unidades**: Total de unidades (muestra 0 si es null o undefined)
- **Botón "Ver detalles"**: Abre modal con información completa

**El `DetailsModal` muestra:**
- **Información Básica**: Proyecto, Fase, Torre, Período, Categoría, Estado
- **Ubicación**: País, Departamento, Municipio, Zona
- **Desarrollador**: Nombre del desarrollador
- **Fechas**: Fecha Inicio, Fecha Entrega (formateadas)
- **Unidades**: Total Unidades, Unidades Disponibles (muestra 0 si es null)
- **Precios**: Precio Promedio, Cuota Promedio, Ingresos Promedio
- **Información Adicional**: Tipo de Seguridad, Cantidad Accesos, URL Imagen (link clickeable)

---

## 🏗️ Arquitectura por Capas

### Capa de Presentación (UI)
**Ubicación:** `app/(ui)/components/`

Componentes presentacionales que solo reciben props y renderizan UI:

**Módulo 0 - Autenticación:**
- **`app/page.tsx`** - Página de login (raíz `/`)
- **`AuthIntro`** - Panel izquierdo informativo (solo lectura)
- **`AuthCard`** - Contenedor del formulario de autenticación
- **`AuthTabs`** - Tabs para alternar entre Login y Register
- **`LoginForm`** - Formulario de inicio de sesión
- **`RegisterForm`** - Formulario de registro con validación
- **`TextInput`** - Input de texto reutilizable con validación
- **`PasswordInput`** - Input de contraseña con toggle mostrar/ocultar
- **`PrimaryButton`** - Botón principal con estados de loading

**Módulo 1 - Búsqueda y Filtros:**
- **`app/search/page.tsx`** - Página principal de búsqueda (`/search`)
- **`ProjectAutocomplete`** - Input y dropdown con búsqueda en tiempo real (área principal, arriba)
- **`FiltersBar`** - Sidebar persistente con selectores de filtros (zona, categoría y período)

**Módulo 2 - Visualización de Resultados:**
- **`ResultsList`** - Contenedor principal de resultados con estados de carga/error (área principal, parte inferior)
- **`ResultItem`** - Item individual que muestra: proyecto, categoría, zona, período, total unidades
- **`Pagination`** - Navegación entre páginas con información de resultados (siempre presente si hay páginas)
- **`app/records/[id]/page.tsx`** - Página de detalles del proyecto (ruta dinámica)
- **`RecordDetailsContent`** - Contenido de detalles organizados en secciones (reutilizable)

### Capa de Lógica (Hooks)
**Ubicación:** `src/hooks/`

Hooks personalizados que encapsulan lógica de negocio:

**Módulo 0 - Autenticación:**
- **`useAuth`** - Manejo de login y register, redirección automática, estados de loading/error

**Módulo 1 - Búsqueda y Filtros:**
- **`useProjectAutocomplete`** - Búsqueda con debounce (300ms), gestión de estado del autocomplete, eliminación de duplicados (máx 50 únicos)
- **`useCatalogs`** - Carga automática de catálogos cuando cambia el proyecto (zonas, categorías y períodos en paralelo)
- **`useRecordsSearch`** - Búsqueda paginada automática (5 por página), se ejecuta automáticamente cuando cambian proyecto o filtros (zona, categoría, período), gestión de página y resultados

**Módulo 2 - Visualización de Resultados:**
- **`useRecordsSearch`** - Gestión de resultados, búsqueda automática al cambiar página, estados de carga/error
- **`useRecordDetails`** - Cache de detalles (useRef con Map), carga de datos desde API, sin modal (rediseñado para página dedicada)

### Capa de Servicios (API Functions)
**Ubicación:** `src/lib/api/`

Funciones que abstraen las llamadas a la API:

- **`projects.api.ts`** - `searchProjects(query: string)` - Búsqueda por prefijo
- **`catalogs.api.ts`** - `getZones(project: string)`, `getCategories(project: string)`, `getPeriods(project: string)` - Catálogos dinámicos
- **`records.api.ts`** - `searchRecords(params)`, `getRecordDetails(id: number)` - Registros y detalles (soporta filtros: zone, category, period)

### Capa de Utilidades
**Ubicación:** `src/lib/utils/`

Funciones helper reutilizables:

- **`formatters.ts`** - `formatValue(value)`, `formatDate(dateString)` - Formateo de valores y fechas para visualización consistente

### Capa de Backend (API Routes)
**Ubicación:** `app/api/`

Endpoints REST que procesan requests y consultan la base de datos:

- **`/api/projects`** - Búsqueda por prefijo (máx 50 únicos, sin duplicados)
- **`/api/zones`** - Catálogo de zonas únicas por proyecto (ordenadas A-Z)
- **`/api/categories`** - Catálogo de categorías únicas por proyecto (ordenadas A-Z)
- **`/api/periods`** - Catálogo de períodos únicos por proyecto (ordenados A-Z)
- **`/api/records`** - Resultados filtrados y paginados (5 por página, campos: id, proyecto, categoria, zona, periodo, total_unidades, filtros: zone, category, period)
- **`/api/records/[id]`** - Detalles específicos de un registro (solo campos necesarios: proyecto, fase, torre, periodo, categoria, pais, departamento, municipio, zona, desarrollador, estado, fecha_inicio, fecha_entrega, total_unidades, unidades_disponibles, tipo_de_seguridad, precio_promedio, cuota_promedio, ingresos_promedio, cantidad_accesos, url_imagen)

### Capa de Datos
**Ubicación:** `prisma/`, `src/lib/prisma.ts`

- **`schema.prisma`** - Definición de modelos (36 modelos importados desde MySQL)
- **`prisma.ts`** - Singleton de PrismaClient (previene múltiples instancias en desarrollo)
- **`generated/prisma/`** - Cliente generado por Prisma

### Capa de Tipos
**Ubicación:** `src/types/`

- **`domain.ts`** - Tipos del dominio de negocio:
  - `Project` - { id, proyecto, categoria, zona, periodo, total_unidades }
  - `SelectedProject` - { proyecto, categoria, zona }
  - `RecordDetails` - Campos específicos de la página de detalles (proyecto, fase, torre, periodo, categoria, pais, departamento, municipio, zona, desarrollador, estado, fecha_inicio, fecha_entrega, total_unidades, unidades_disponibles, tipo_de_seguridad, precio_promedio, cuota_promedio, ingresos_promedio, cantidad_accesos, url_imagen, latitud, longitud)
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

### Flujo de Detalles del Modal (Módulo 2)

```
ResultItem (click en "Ver detalles")
  ↓ (callback)
page.tsx (onOpenDetails)
  ↓ (usa hook)
useRecordDetails.openDetails(id)
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
  ↓ (muestra modal)
DetailsModal
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
        │    período, total unidades)       │
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
        │   DetailsModal                    │
        │   (Muestra todos los campos)      │
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
- **Total Unidades**: Total de unidades (muestra 0 si es null o undefined)
- **Botón "Ver detalles"**: Abre modal con información completa

**El `DetailsModal` muestra (solo campos necesarios):**

- **Información Básica**: Proyecto, Fase, Torre, Período, Categoría, Estado
- **Ubicación**: País, Departamento, Municipio, Zona
- **Desarrollador**: Nombre del desarrollador
- **Fechas**: Fecha Inicio, Fecha Entrega (formateadas)
- **Unidades**: Total Unidades (muestra 0 si es null), Unidades Disponibles (muestra 0 si es null)
- **Precios**: Precio Promedio, Cuota Promedio, Ingresos Promedio
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

**Última actualización:** Diciembre 2024
