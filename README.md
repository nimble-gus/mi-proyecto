# Mi Proyecto - Filtrado de Proyectos

Aplicación fullstack desarrollada con Next.js y TypeScript que permite seleccionar proyectos, filtrar por zona y categoría, y visualizar resultados paginados con detalles completos.

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
│   │   ├── page.tsx                    # Componente principal (composición)
│   │   └── components/
│   │       ├── ProjectAutocomplete.tsx # Selector de proyecto con autocomplete
│   │       ├── FiltersBar.tsx          # Filtros de zona y categoría
│   │       ├── ResultsList.tsx         # Lista de resultados paginados
│   │       ├── ResultItem.tsx          # Item individual de resultado
│   │       ├── DetailsModal.tsx        # Modal con detalles completos
│   │       └── Pagination.tsx          # Componente de paginación
│   ├── api/
│   │   ├── projects/
│   │   │   └── route.ts                # GET /api/projects - Búsqueda por prefijo
│   │   ├── zones/
│   │   │   └── route.ts                # GET /api/zones - Catálogo de zonas
│   │   ├── categories/
│   │   │   └── route.ts                # GET /api/categories - Catálogo categorías
│   │   └── records/
│   │       ├── route.ts                # GET /api/records - Resultados paginados
│   │       └── [id]/
│   │           └── route.ts            # GET /api/records/[id] - Detalles completos
│   ├── layout.tsx
│   └── globals.css
├── src/
│   ├── hooks/
│   │   ├── useProjectAutocomplete.ts   # Hook: autocomplete + debounce
│   │   ├── useCatalogs.ts              # Hook: carga de catálogos
│   │   ├── useRecordsSearch.ts        # Hook: búsqueda paginada
│   │   └── useRecordDetails.ts        # Hook: modal + cache
│   ├── lib/
│   │   ├── prisma.ts                  # PrismaClient singleton
│   │   └── api/
│   │       ├── projects.api.ts         # API: búsqueda de proyectos
│   │       ├── catalogs.api.ts        # API: zonas y categorías
│   │       └── records.api.ts         # API: registros y detalles
│   └── types/
│       ├── domain.ts                  # Tipos del dominio (Project, RecordDetails)
│       └── api.ts                     # Tipos de respuestas API
├── generated/
│   └── prisma/                        # Cliente de Prisma generado
├── prisma/
│   └── schema.prisma                  # Schema de Prisma (36 modelos)
├── .env                               # Variables de entorno
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
```

**Componentes involucrados:**
- `ProjectAutocomplete` - Input con dropdown
- `useProjectAutocomplete` - Hook con debounce y búsqueda

### 2. Aplicación de Filtros

```
Proyecto seleccionado
    ↓
Filtros disponibles (zona y categoría)
    ↓
Usuario selecciona filtros (opcional)
    ↓
Usuario hace click en "Buscar"
    ↓
GET /api/records?project=...&zone=...&category=...&page=1&pageSize=5
```

**Componentes involucrados:**
- `FiltersBar` - Selectores de zona y categoría
- `useCatalogs` - Hook que carga catálogos dinámicos
- `useRecordsSearch` - Hook que ejecuta búsqueda paginada

### 3. Visualización de Resultados Paginados

```
Búsqueda ejecutada
    ↓
Muestra 5 resultados por página
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
- `ResultItem` - Item individual
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
- `ProjectAutocomplete` - Input y dropdown
- `FiltersBar` - Selectores de filtros
- `ResultsList` - Lista de resultados
- `ResultItem` - Item individual
- `DetailsModal` - Modal de detalles
- `Pagination` - Navegación de páginas

### Capa de Lógica (Hooks)
**Ubicación:** `src/hooks/`

Hooks personalizados que encapsulan lógica de negocio:
- `useProjectAutocomplete` - Búsqueda con debounce, gestión de estado del autocomplete
- `useCatalogs` - Carga automática de catálogos cuando cambia el proyecto
- `useRecordsSearch` - Búsqueda paginada, gestión de página y resultados
- `useRecordDetails` - Gestión del modal, cache de detalles, carga de datos

### Capa de Servicios (API)
**Ubicación:** `src/lib/api/`

Funciones que abstraen las llamadas a la API:
- `projects.api.ts` - `searchProjects(query)`
- `catalogs.api.ts` - `getZones(project)`, `getCategories(project)`
- `records.api.ts` - `searchRecords(params)`, `getRecordDetails(id)`

### Capa de Backend (API Routes)
**Ubicación:** `app/api/`

Endpoints REST que procesan requests y consultan la base de datos:
- `/api/projects` - Búsqueda por prefijo (máx 50 únicos)
- `/api/zones` - Catálogo de zonas por proyecto
- `/api/categories` - Catálogo de categorías por proyecto
- `/api/records` - Resultados filtrados y paginados (5 por página)
- `/api/records/[id]` - Detalles completos de un registro

### Capa de Datos
**Ubicación:** `prisma/`, `src/lib/prisma.ts`

- `schema.prisma` - Definición de modelos (36 modelos desde MySQL)
- `prisma.ts` - Singleton de PrismaClient
- `generated/prisma/` - Cliente generado por Prisma

### Capa de Tipos
**Ubicación:** `src/types/`

- `domain.ts` - Tipos del dominio de negocio (Project, RecordDetails, etc.)
- `api.ts` - Tipos de respuestas de la API

---

## 🔀 Flujo de Datos Completo

### Flujo de Búsqueda de Proyectos

```
page.tsx
  ↓ (usa hook)
useProjectAutocomplete
  ↓ (llama API)
projects.api.ts
  ↓ (fetch)
GET /api/projects?q=...
  ↓ (consulta DB)
Prisma → MySQL
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
  catalogs.api.ts.getCategories()
])
  ↓ (fetch paralelo)
GET /api/zones?project=...
GET /api/categories?project=...
  ↓ (consulta DB)
Prisma → MySQL
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
GET /api/records?project=...&zone=...&category=...&page=1&pageSize=5
  ↓ (consulta DB con paginación)
Prisma.findMany({ skip, take })
  ↓ (respuesta)
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
        Prisma.findUnique({ where: { id } })
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
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   FiltersBar                      │
        │   (Usuario selecciona filtros)    │
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
        │   GET /api/records?...&page=1     │
        │   &pageSize=5                     │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   ResultsList                     │
        │   (Muestra 5 resultados)         │
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
- Cache de detalles (Map)
- Paginación (5 items por página)
- Lazy loading de catálogos

---

**Última actualización:** Diciembre 2024
