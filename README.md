# Mi Proyecto - Filtrado de Proyectos

Aplicación fullstack desarrollada con Next.js y TypeScript que permite seleccionar proyectos, filtrar por zona, categoría y período, y visualizar resultados paginados con detalles completos.

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
│   ├── (ui)/
│   │   ├── page.tsx                    # Componente principal (solo composición)
│   │   └── components/
│   │       ├── ProjectAutocomplete.tsx # Selector de proyecto con autocomplete
│   │       ├── FiltersBar.tsx          # Filtros de zona, categoría y período
│   │       ├── ResultsList.tsx         # Lista de resultados paginados
│   │       ├── ResultItem.tsx          # Item individual (proyecto, categoría, zona, período)
│   │       ├── DetailsModal.tsx        # Modal con detalles completos
│   │       └── Pagination.tsx          # Componente de paginación (5 por página)
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
│   ├── layout.tsx
│   └── globals.css
├── src/
│   ├── hooks/
│   │   ├── useProjectAutocomplete.ts   # Hook: autocomplete + debounce (300ms)
│   │   ├── useCatalogs.ts              # Hook: carga automática de catálogos (zonas, categorías, períodos)
│   │   ├── useRecordsSearch.ts        # Hook: búsqueda paginada (5 por página)
│   │   └── useRecordDetails.ts        # Hook: modal + cache de detalles
│   ├── lib/
│   │   ├── prisma.ts                  # PrismaClient singleton
│   │   └── api/
│   │       ├── projects.api.ts         # API: searchProjects(query)
│   │       ├── catalogs.api.ts        # API: getZones(project), getCategories(project), getPeriods(project)
│   │       └── records.api.ts         # API: searchRecords(params), getRecordDetails(id)
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

## 🔄 Flujo de la Aplicación

### 1. Búsqueda y Selección de Proyecto

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
Se carga automáticamente:
  - GET /api/zones?project=...
  - GET /api/categories?project=...
  - GET /api/periods?project=...
```

**Componentes involucrados:**
- `ProjectAutocomplete` - Input con dropdown
- `useProjectAutocomplete` - Hook con debounce y búsqueda

### 2. Aplicación de Filtros

```
Proyecto seleccionado
    ↓
Filtros disponibles (zona, categoría y período)
    ↓
Usuario selecciona filtros (opcional)
    ↓
Usuario hace click en "Buscar"
    ↓
GET /api/records?project=...&zone=...&category=...&period=...&page=1&pageSize=5
```

**Componentes involucrados:**
- `FiltersBar` - Selectores de zona, categoría y período
- `useCatalogs` - Hook que carga catálogos dinámicos (zonas, categorías, períodos)
- `useRecordsSearch` - Hook que ejecuta búsqueda paginada con todos los filtros

### 3. Visualización de Resultados Paginados

```
Búsqueda ejecutada
    ↓
Muestra 5 resultados por página
    ↓
Cada resultado muestra:
  - Proyecto
  - Categoría
  - Zona (si existe)
  - Período
    ↓
Información de paginación:
  - "Mostrando X - Y de Z resultados"
  - "Página X de Y"
  - Botones Anterior/Siguiente
    ↓
Usuario navega entre páginas
    ↓
Búsqueda automática con nueva página
```

**Componentes involucrados:**
- `ResultsList` - Lista de resultados
- `ResultItem` - Item individual (muestra proyecto, categoría, zona, período)
- `Pagination` - Navegación de páginas
- `useRecordsSearch` - Hook con lógica de paginación

### 4. Visualización de Detalles

```
Usuario hace click en "Ver detalles"
    ↓
Verifica cache (Map<id, details>)
    ↓
Si no está en cache:
  GET /api/records/[id]
    ↓
Muestra modal con todos los campos:
  - Información Básica
  - Ubicación
  - Fechas
  - Desarrollador
  - Unidades y Área
  - Precios
  - Parqueos
  - Información Adicional
```

**Componentes involucrados:**
- `DetailsModal` - Modal con detalles completos
- `useRecordDetails` - Hook con cache y carga de detalles

---

## 🏗️ Arquitectura por Capas

### Capa de Presentación (UI)
**Ubicación:** `app/(ui)/components/`

Componentes presentacionales que solo reciben props y renderizan UI:

- **`ProjectAutocomplete`** - Input y dropdown con búsqueda en tiempo real
- **`FiltersBar`** - Selectores de filtros (zona, categoría y período)
- **`ResultsList`** - Lista de resultados con estados de carga/error
- **`ResultItem`** - Item individual que muestra: proyecto, categoría, zona, período
- **`DetailsModal`** - Modal con detalles completos organizados en secciones
- **`Pagination`** - Navegación entre páginas con información de resultados

### Capa de Lógica (Hooks)
**Ubicación:** `src/hooks/`

Hooks personalizados que encapsulan lógica de negocio:

- **`useProjectAutocomplete`** - Búsqueda con debounce (300ms), gestión de estado del autocomplete, eliminación de duplicados
- **`useCatalogs`** - Carga automática de catálogos cuando cambia el proyecto (zonas, categorías y períodos en paralelo)
- **`useRecordsSearch`** - Búsqueda paginada (5 por página), gestión de página y resultados, búsqueda automática al cambiar página, soporte para filtros múltiples (zona, categoría, período)
- **`useRecordDetails`** - Gestión del modal, cache de detalles (Map), carga de datos desde API

### Capa de Servicios (API Functions)
**Ubicación:** `src/lib/api/`

Funciones que abstraen las llamadas a la API:

- **`projects.api.ts`** - `searchProjects(query: string)` - Búsqueda por prefijo
- **`catalogs.api.ts`** - `getZones(project: string)`, `getCategories(project: string)`, `getPeriods(project: string)` - Catálogos dinámicos
- **`records.api.ts`** - `searchRecords(params)`, `getRecordDetails(id: number)` - Registros y detalles (soporta filtros: zone, category, period)

### Capa de Backend (API Routes)
**Ubicación:** `app/api/`

Endpoints REST que procesan requests y consultan la base de datos:

- **`/api/projects`** - Búsqueda por prefijo (máx 50 únicos, sin duplicados)
- **`/api/zones`** - Catálogo de zonas únicas por proyecto (ordenadas A-Z)
- **`/api/categories`** - Catálogo de categorías únicas por proyecto (ordenadas A-Z)
- **`/api/periods`** - Catálogo de períodos únicos por proyecto (ordenados A-Z)
- **`/api/records`** - Resultados filtrados y paginados (5 por página, campos: id, proyecto, categoria, zona, periodo, filtros: zone, category, period)
- **`/api/records/[id]`** - Detalles completos de un registro (todos los campos)

### Capa de Datos
**Ubicación:** `prisma/`, `src/lib/prisma.ts`

- **`schema.prisma`** - Definición de modelos (36 modelos importados desde MySQL)
- **`prisma.ts`** - Singleton de PrismaClient (previene múltiples instancias en desarrollo)
- **`generated/prisma/`** - Cliente generado por Prisma

### Capa de Tipos
**Ubicación:** `src/types/`

- **`domain.ts`** - Tipos del dominio de negocio:
  - `Project` - { id, proyecto, categoria, zona, periodo }
  - `SelectedProject` - { proyecto, categoria, zona }
  - `RecordDetails` - Todos los campos de housing_universe
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

### Flujo de Búsqueda de Resultados

```
page.tsx (click en "Buscar")
  ↓ (usa hook)
useRecordsSearch.handleSearch()
  ↓ (llama API)
records.api.ts.searchRecords()
  ↓ (fetch)
GET /api/records?project=...&zone=...&category=...&period=...&page=1&pageSize=5
  ↓ (consulta DB con paginación)
Prisma.housing_universe.count({ where })
Prisma.housing_universe.findMany({ skip, take })
  ↓ (respuesta con: id, proyecto, categoria, zona, periodo)
records.api.ts → useRecordsSearch → page.tsx → ResultsList → ResultItem
```

### Flujo de Navegación de Páginas

```
Pagination (click en Anterior/Siguiente)
  ↓ (callback)
page.tsx (onPreviousPage/onNextPage)
  ↓ (actualiza estado)
useRecordsSearch.setPage(newPage)
  ↓ (ejecuta búsqueda automática)
useRecordsSearch.handleSearch(newPage)
  ↓ (mismo flujo que búsqueda inicial)
GET /api/records?...&page=newPage&pageSize=5
```

### Flujo de Detalles del Modal

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

## 📊 Diagrama de Flujo Principal

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
        │   FiltersBar                      │
        │   (Usuario selecciona filtros:   │
        │    zona, categoría, período)     │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   Click en "Buscar"               │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   useRecordsSearch.handleSearch() │
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
        ┌───────────────────────────────────┐
        │   ResultsList                     │
        │   (Muestra 5 resultados)          │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   ResultItem                      │
        │   (proyecto, categoría, zona,     │
        │    período)                       │
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
- Búsqueda automática al cambiar página (solo si ya se buscó)

---

## 📝 Campos de Resultados

Cada resultado en la lista muestra:
- **ID**: Identificador único del registro
- **Proyecto**: Nombre del proyecto
- **Categoría**: Categoría del registro
- **Zona**: Zona del registro (puede ser null)
- **Período**: Período del registro

---

**Última actualización:** Diciembre 2024
