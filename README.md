# Mi Proyecto - Filtrado de Proyectos

Aplicación fullstack desarrollada con Next.js y TypeScript que permite seleccionar proyectos, filtrar por zona y categoría, y visualizar resultados paginados. El sistema implementa un flujo completo de filtrado optimizado para grandes volúmenes de datos.

## 🛠️ Stack Tecnológico

### Frontend & Backend
- **Next.js 16.1.2** - Framework React con App Router
- **TypeScript** - Tipado estático para frontend y backend
- **React 19.2.3** - Biblioteca para la interfaz de usuario
- **TailwindCSS** - Framework de CSS utility-first

### Base de Datos
- **Prisma 6.19.2** - ORM para TypeScript/Node.js
- **MySQL** - Sistema de gestión de base de datos relacional
- **DBeaver** - Herramienta de administración de base de datos

## 📁 Estructura del Proyecto

```
mi-proyecto/
├── app/
│   ├── (ui)/
│   │   └── page.tsx          # Frontend (filtrado completo) ✅
│   ├── api/
│   │   ├── projects/
│   │   │   └── route.ts      # GET /api/projects - Búsqueda por prefijo ✅
│   │   ├── zones/
│   │   │   └── route.ts      # GET /api/zones - Catálogo de zonas ✅
│   │   ├── categories/
│   │   │   └── route.ts      # GET /api/categories - Catálogo categorías ✅
│   │   └── records/
│   │       └── route.ts      # GET /api/records - Resultados paginados ✅
│   ├── layout.tsx
│   ├── globals.css
│   └── favicon.ico
├── src/
│   ├── lib/
│   │   └── prisma.ts         # PrismaClient singleton ✅
│   ├── services/             # Lógica de negocio (futuro)
│   ├── repositories/         # Consultas Prisma (futuro)
│   ├── validators/           # Validación de datos (futuro)
│   └── types/                # Tipos y DTOs (futuro)
├── generated/
│   └── prisma/               # Cliente de Prisma generado
├── prisma/
│   └── schema.prisma         # Schema de Prisma (36 modelos importados)
├── .env                      # Variables de entorno
├── package.json
└── README.md
```

## 🎯 Funcionalidad Principal

### Sistema de Filtrado de Proyectos

La aplicación implementa un sistema completo de filtrado que permite:
1. **Buscar y seleccionar proyectos** mediante autocomplete
2. **Filtrar por zona y categoría** basado en el proyecto seleccionado
3. **Visualizar resultados paginados** con navegación entre páginas

### Endpoints API

#### 1. Búsqueda de Proyectos (Autocomplete)

**GET** `/api/projects?q=prefijo`

#### Parámetros de Consulta

- `q` (string, opcional): Término de búsqueda (letra o prefijo) para filtrar por nombre de proyecto

#### Respuesta

La API devuelve un array de hasta 30 proyectos que coinciden con el prefijo. Cada proyecto contiene los siguientes campos desde la tabla `housing_universe`:

```json
{
  "projects": [
    {
      "proyecto": "Nombre del Proyecto",
      "categoria": "Categoría",
      "zona": "Zona"
    }
  ]
}
```

**Características de la búsqueda:**
- Búsqueda por prefijo (`startsWith`) en el campo `proyecto`
- Si `q` tiene 1 letra (ej. "a") → busca nombres que empiecen con esa letra
- Si `q` tiene más letras (ej. "al") → busca nombres que empiecen con ese prefijo
- Máximo 30 resultados ordenados alfabéticamente
- Si `q` está vacío o no se proporciona, retorna `{ projects: [] }`
- Validación de longitud máxima (50 caracteres)

#### 2. Catálogo de Zonas

**GET** `/api/zones?project=nombre_proyecto`

Devuelve las zonas únicas disponibles para un proyecto específico.

**Parámetros:**
- `project` (string, obligatorio): Nombre del proyecto

**Respuesta:**
```json
{
  "zones": ["Zona A", "Zona B", "Zona C"]
}
```

#### 3. Catálogo de Categorías

**GET** `/api/categories?project=nombre_proyecto`

Devuelve las categorías únicas disponibles para un proyecto específico.

**Parámetros:**
- `project` (string, obligatorio): Nombre del proyecto

**Respuesta:**
```json
{
  "categories": ["Categoría 1", "Categoría 2"]
}
```

#### 4. Resultados Filtrados con Paginación

**GET** `/api/records?project=...&zone=...&category=...&page=...&pageSize=...`

Endpoint principal que devuelve registros filtrados con paginación.

**Parámetros:**
- `project` (string, obligatorio): Nombre del proyecto
- `zone` (string, opcional): Zona para filtrar
- `category` (string, opcional): Categoría para filtrar
- `page` (number, opcional, default: 1): Número de página
- `pageSize` (number, opcional, default: 20, max: 50): Items por página

**Respuesta:**
```json
{
  "items": [
    {
      "proyecto": "Nombre del Proyecto",
      "categoria": "Categoría",
      "zona": "Zona"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalItems": 150,
  "totalPages": 8
}
```

### Frontend - Flujo de Filtrado Completo

El componente `app/(ui)/page.tsx` implementa un sistema completo de filtrado con las siguientes características:

**Flujo de Usuario:**
1. **Selector de Proyecto (Autocomplete)**
   - Búsqueda por letra o prefijo con debounce de 300ms
   - Selección habilita los filtros de zona y categoría

2. **Carga de Catálogos**
   - Al seleccionar proyecto, carga automáticamente zonas y categorías disponibles
   - Dropdowns deshabilitados hasta cargar los catálogos

3. **Aplicación de Filtros**
   - Selectores de zona y categoría
   - Cambios en filtros resetean la página a 1
   - Actualización automática de resultados

4. **Visualización de Resultados**
   - Resultados paginados mostrados en tarjetas
   - Paginación con botones Anterior/Siguiente
   - Indicador "Página X de Y"
   - Selector de pageSize (20 o 50 items)

5. **UX Mejorada**
   - Mensajes informativos en cada estado
   - Loading states claros
   - Botón "Limpiar filtros"
   - Diseño responsive y soporte para modo oscuro

**Tecnologías:**
- React Hooks (`useState`, `useEffect`, `useCallback`, `useRef`)
- TypeScript con tipos bien definidos
- Fetch API para comunicación con múltiples endpoints
- Manejo de estados asíncronos complejos

## 🚀 Configuración e Instalación

### Prerrequisitos

- Node.js 18+ 
- MySQL instalado y configurado
- DBeaver (opcional, para gestión de base de datos)

### Instalación

1. Clonar el repositorio (o asegurarse de estar en el directorio del proyecto)

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

Crear un archivo `.env` en la raíz del proyecto con la cadena de conexión a MySQL:

```env
DATABASE_URL="mysql://usuario:contraseña@host:puerto/nombre_base_datos"
```

4. Configurar Prisma con MySQL:

El archivo `prisma/schema.prisma` está configurado para usar MySQL:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

> **Nota:** Este proyecto usa Prisma v6. En v7 la configuración cambió, por lo que se decidió usar v6 para compatibilidad con `new PrismaClient()` sin adapters.

5. Importar el schema de la base de datos existente:

```bash
npx prisma db pull
```

Este comando importa automáticamente todos los modelos y relaciones desde la base de datos MySQL. Se generaron **36 modelos** incluyendo:
- `Projects` - Modelo principal para búsqueda de proyectos
- `Applications`, `Categories`, `Departments`, `Units`, etc.

6. Generar el cliente de Prisma:

```bash
npx prisma generate
```

Este comando genera el cliente de Prisma en `app/generated/prisma` que se utilizará para realizar consultas a la base de datos.

## ✅ Configuración Completada

- ✅ Conexión a MySQL configurada (`.env` con `DATABASE_URL`)
- ✅ Prisma v6.19.2 instalado y configurado
- ✅ Schema de Prisma importado desde la base de datos (36 modelos)
- ✅ Cliente de Prisma generado en `app/generated/prisma`
- ✅ Dependencias instaladas (incluyendo `dotenv`)
- ✅ `lib/prisma.ts` - Singleton de PrismaClient implementado
- ✅ `app/api/projects/route.ts` - Endpoint GET implementado
- ✅ `app/page.tsx` - Frontend completo con búsqueda en tiempo real

## 🏃 Ejecutar el Proyecto

### Modo Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Modo Producción

```bash
npm run build
npm start
```

## 📝 Desarrollo

### Configuración de Prisma Client

El archivo `lib/prisma.ts` exporta una instancia singleton de PrismaClient para evitar múltiples conexiones en desarrollo con hot-reload de Next.js. El cliente generado se encuentra en `app/generated/prisma`.

**Importante:** Se usa Prisma v6 (no v7) para evitar la necesidad de adapters o accelerateUrl. Con v6, `new PrismaClient()` funciona sin configuración adicional.

### Endpoints Backend Implementados

#### 1. `/api/projects` - Búsqueda por Prefijo

**Archivo:** `app/api/projects/route.ts`

- Búsqueda por prefijo en el campo `proyecto` (autocomplete)
- Máximo 30 resultados ordenados alfabéticamente
- Validación de longitud (200 caracteres máximo)

#### 2. `/api/zones` - Catálogo de Zonas

**Archivo:** `app/api/zones/route.ts`

- Devuelve zonas únicas filtradas por proyecto
- Ordenadas alfabéticamente
- Excluye valores nulos y vacíos

#### 3. `/api/categories` - Catálogo de Categorías

**Archivo:** `app/api/categories/route.ts`

- Devuelve categorías únicas filtradas por proyecto
- Ordenadas alfabéticamente
- Excluye valores vacíos

#### 4. `/api/records` - Resultados Filtrados con Paginación

**Archivo:** `app/api/records/route.ts`

- Filtrado por proyecto (obligatorio), zona y categoría (opcionales)
- Paginación con `page` y `pageSize` (máx 50)
- Retorna `items`, `page`, `pageSize`, `totalItems`, `totalPages`
- Orden estable para paginación consistente

### Frontend - Flujo Completo de Filtrado

**Archivo:** `app/(ui)/page.tsx`

**Estados implementados:**
- Selección: `selectedProject`, `selectedZone`, `selectedCategory`
- Catálogos: `zones`, `categories`, `loadingCatalogues`
- Resultados: `items`, `page`, `pageSize`, `totalPages`, `totalItems`, `loadingResults`

**Funcionalidades:**
1. ✅ Selector de proyecto con autocomplete (debounce 300ms)
2. ✅ Carga automática de catálogos al seleccionar proyecto
3. ✅ Filtros de zona y categoría (deshabilitados hasta cargar)
4. ✅ Aplicación de filtros con reset automático de página
5. ✅ Resultados paginados con navegación
6. ✅ Selector de pageSize (20/50)
7. ✅ Botón "Limpiar filtros"
8. ✅ Estados de carga y mensajes informativos
9. ✅ Manejo de errores completo

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta ESLint

## 📋 Estado del Proyecto

### ✅ Completado - Proyecto Funcional

1. ✅ Estructura del proyecto configurada (Next.js + TypeScript)
2. ✅ Prisma v6.19.2 instalado y configurado para MySQL
3. ✅ Conexión a la base de datos establecida
4. ✅ Schema importado desde MySQL (36 modelos desde `housing_universe`, `Projects`, etc.)
5. ✅ Cliente de Prisma generado en `generated/prisma`
6. ✅ `src/lib/prisma.ts` - Singleton de PrismaClient implementado
7. ✅ **Backend - Endpoints API:**
   - `app/api/projects/route.ts` - Búsqueda por prefijo (autocomplete)
   - `app/api/zones/route.ts` - Catálogo de zonas por proyecto
   - `app/api/categories/route.ts` - Catálogo de categorías por proyecto
   - `app/api/records/route.ts` - Resultados filtrados con paginación
8. ✅ **Frontend - Flujo completo:**
   - `app/(ui)/page.tsx` - Sistema de filtrado completo
   - Selector de proyecto con autocomplete
   - Filtros de zona y categoría
   - Resultados paginados con navegación
   - Carga de catálogos dependientes
9. ✅ Búsqueda por prefijo implementada (máx 30 resultados)
10. ✅ Filtrado por proyecto, zona y categoría
11. ✅ Paginación implementada (page, pageSize, totalPages, totalItems)
12. ✅ Debounce implementado (300ms) para búsqueda
13. ✅ Manejo de estados completo (loading, error, resultados vacíos)
14. ✅ Diseño responsive con Tailwind CSS
15. ✅ TypeScript con tipos bien definidos

### 🎉 Proyecto Listo para Usar

El proyecto está completamente funcional. Puedes:
- Iniciar el servidor con `npm run dev`
- Acceder a [http://localhost:3000](http://localhost:3000)
- **Buscar proyectos** por nombre en tiempo real
- **Seleccionar un proyecto** para habilitar filtros
- **Filtrar por zona y categoría** para refinar resultados
- **Navegar entre páginas** de resultados paginados

## 🧪 Probar la Aplicación

### Desde el Navegador (Recomendado)

1. Inicia el servidor:
   ```bash
   npm run dev
   ```

2. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

3. **Flujo completo de uso:**
   - **Buscar proyecto**: Escribe en el selector, el dropdown se abre automáticamente
   - **Seleccionar proyecto**: Al seleccionar, se cargan automáticamente los catálogos de zonas y categorías
   - **Filtrar**: Usa los selectores de zona y categoría para refinar los resultados
   - **Ver resultados**: Los resultados se muestran paginados (20 por defecto)
   - **Navegar**: Usa los botones Anterior/Siguiente para cambiar de página
   - **Limpiar**: Usa "Limpiar filtros" para resetear zona y categoría, o "Limpiar" para cambiar de proyecto

### Probar los Endpoints Directamente

También puedes probar los endpoints directamente:

```bash
# 1. Búsqueda de proyectos (autocomplete)
GET http://localhost:3000/api/projects?q=a

# 2. Catálogo de zonas (requiere proyecto seleccionado)
GET http://localhost:3000/api/zones?project=NombreProyecto

# 3. Catálogo de categorías (requiere proyecto seleccionado)
GET http://localhost:3000/api/categories?project=NombreProyecto

# 4. Resultados filtrados con paginación
GET http://localhost:3000/api/records?project=NombreProyecto
GET http://localhost:3000/api/records?project=NombreProyecto&zone=ZonaA
GET http://localhost:3000/api/records?project=NombreProyecto&category=Cat1
GET http://localhost:3000/api/records?project=NombreProyecto&zone=ZonaA&category=Cat1&page=2&pageSize=50
```

### Verificar en DBeaver

Puedes comparar los resultados con consultas directas en DBeaver:

```sql
-- Búsqueda por prefijo (autocomplete)
SELECT DISTINCT proyecto, categoria, zona 
FROM housing_universe 
WHERE proyecto LIKE 'a%'
ORDER BY proyecto ASC 
LIMIT 30;

-- Catálogo de zonas (filtrado por proyecto)
SELECT DISTINCT zona 
FROM housing_universe 
WHERE proyecto = 'NombreProyecto' AND zona IS NOT NULL AND zona != ''
ORDER BY zona ASC;

-- Resultados filtrados con paginación
SELECT proyecto, categoria, zona 
FROM housing_universe 
WHERE proyecto = 'NombreProyecto' 
  AND zona = 'ZonaA'  -- opcional
  AND categoria = 'Cat1'  -- opcional
ORDER BY proyecto ASC, id ASC
LIMIT 20 OFFSET 0;
```

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
mi-proyecto/
├── app/                                    # Directorio principal de Next.js App Router
│   ├── (ui)/                               # Grupo de rutas UI (route group)
│   │   └── page.tsx                        # Página principal (Sistema de filtrado completo) ✅
│   │
│   ├── api/                                # API Routes (Backend)
│   │   ├── projects/
│   │   │   └── route.ts                    # GET /api/projects - Búsqueda por prefijo ✅
│   │   ├── zones/
│   │   │   └── route.ts                    # GET /api/zones - Catálogo de zonas ✅
│   │   ├── categories/
│   │   │   └── route.ts                    # GET /api/categories - Catálogo categorías ✅
│   │   └── records/
│   │       └── route.ts                    # GET /api/records - Resultados paginados ✅
│   │
│   ├── layout.tsx                          # Layout raíz de la aplicación
│   ├── globals.css                         # Estilos globales con Tailwind CSS
│   └── favicon.ico                         # Favicon de la aplicación
│
├── src/                                    # Código fuente del proyecto (no Next.js)
│   ├── lib/
│   │   └── prisma.ts                       # Singleton de PrismaClient
│   │
│   ├── services/                           # Lógica de negocio
│   │   └── projects.service.ts             # (Futuro) Servicios de proyectos
│   │
│   ├── repositories/                       # Acceso a datos (Prisma queries)
│   │   └── projects.repo.ts                # (Futuro) Repositorio de proyectos
│   │
│   ├── validators/                         # Validación de datos
│   │   └── projects.query.ts               # (Futuro) Validación de query params (Zod)
│   │
│   └── types/                              # Tipos y DTOs
│       └── api.ts                          # (Futuro) Tipos de respuesta API
│
├── generated/                              # Archivos generados (no modificar)
│   └── prisma/                             # Cliente de Prisma generado
│       ├── client.ts                       # PrismaClient export
│       ├── browser.ts                      # Cliente para browser
│       ├── enums.ts                        # Enumeraciones de Prisma
│       ├── models/                         # Modelos TypeScript generados
│       │   ├── housing_universe.ts         # Modelo housing_universe
│       │   ├── Projects.ts                 # Modelo Projects
│       │   └── ... (36 modelos en total)
│       ├── models.ts                       # Export de todos los modelos
│       └── internal/                       # Archivos internos de Prisma
│
├── prisma/                                 # Configuración de Prisma
│   └── schema.prisma                       # Schema de Prisma (36 modelos importados)
│
├── public/                                 # Archivos estáticos
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── .env                                    # Variables de entorno (DATABASE_URL)
├── .gitignore                              # Archivos ignorados por Git
├── eslint.config.mjs                       # Configuración de ESLint
├── next.config.ts                          # Configuración de Next.js
├── next-env.d.ts                           # Tipos de Next.js (generado)
├── package.json                            # Dependencias y scripts del proyecto
├── package-lock.json                       # Lock file de npm
├── postcss.config.mjs                      # Configuración de PostCSS para Tailwind
├── prisma.config.ts                        # Configuración de Prisma (opcional)
├── README.md                               # Este archivo
└── tsconfig.json                           # Configuración de TypeScript
```

### Flujo de Datos

```
┌─────────────────┐
│   Usuario       │
│   Escribe en    │
│   selector      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ app/(ui)/       │ ◄─── Frontend: Componente Selector/Autocomplete
│ page.tsx        │      - Estados: query, options, isOpen, selected
│                 │      - Debounce 300ms
│                 │      - Lógica de primera palabra
│                 │      - Manejo de selección y limpieza
└────────┬────────┘
         │
         │ fetch("/api/projects?q=...")
         ▼
┌─────────────────┐
│ app/api/        │ ◄─── Backend: API Route Handler
│ projects/       │      - GET /api/projects
│ route.ts        │      - Normaliza query (trim)
│                 │      - Validación de longitud
│                 │      - (Futuro: servicios/repositorios)
└────────┬────────┘
         │
         │ prisma.housing_universe.findMany()
         ▼
┌─────────────────┐
│ src/lib/        │ ◄─── Singleton de PrismaClient
│ prisma.ts       │      - Evita múltiples conexiones
│                 │      - Reutilizable en toda la app
└────────┬────────┘
         │
         │ Prisma ORM
         ▼
┌─────────────────┐
│ generated/      │ ◄─── Cliente de Prisma generado
│ prisma/         │      - Tipos TypeScript
│                 │      - Modelos de base de datos
└────────┬────────┘
         │
         │ MySQL Query (startsWith)
         ▼
┌─────────────────┐
│   MySQL DB      │ ◄─── Base de datos
│ housing_universe│      - Tabla: housing_universe
│                 │      - Campos: proyecto, categoria, zona
└─────────────────┘
```

### Componentes Principales

#### 1. Frontend (`app/(ui)/page.tsx`)
- **Tipo**: Componente React Client Component
- **Ubicación**: Route group `(ui)` - no afecta la URL
- **Responsabilidad**: Sistema completo de filtrado con paginación
- **Estados principales**: 
  - Selección: `selectedProject`, `selectedZone`, `selectedCategory`
  - Catálogos: `zones`, `categories`, `loadingCatalogues`
  - Resultados: `items`, `page`, `pageSize`, `totalPages`, `totalItems`, `loadingResults`
  - Autocomplete: `query`, `options`, `isOpen`, `loading`, `error`
- **Funcionalidades**:
  - Selector de proyecto con autocomplete (debounce 300ms)
  - Carga automática de catálogos dependientes
  - Filtrado dinámico por zona y categoría
  - Resultados paginados con navegación
  - Estados de carga y mensajes informativos

#### 2. Backend API - Endpoints Múltiples

**`app/api/projects/route.ts`** - Búsqueda por Prefijo
- Recibir query param `q`
- Búsqueda por prefijo en campo `proyecto`
- Retornar hasta 30 resultados para autocomplete

**`app/api/zones/route.ts`** - Catálogo de Zonas
- Recibir query param `project`
- Filtrar y obtener zonas únicas
- Retornar lista ordenada alfabéticamente

**`app/api/categories/route.ts`** - Catálogo de Categorías
- Recibir query param `project`
- Filtrar y obtener categorías únicas
- Retornar lista ordenada alfabéticamente

**`app/api/records/route.ts`** - Resultados Filtrados
- Recibir query params: `project`, `zone`, `category`, `page`, `pageSize`
- Aplicar filtros dinámicos
- Implementar paginación
- Retornar resultados con metadata de paginación

#### 3. Prisma Client (`src/lib/prisma.ts`)
- **Tipo**: Singleton utility
- **Ubicación**: `src/lib/` - código compartido del proyecto
- **Responsabilidad**: 
  - Instanciar PrismaClient una sola vez
  - Reutilizar en desarrollo (hot-reload)
  - Configurar logs según entorno
  - Centralizar acceso a base de datos

#### 4. Schema de Prisma (`prisma/schema.prisma`)
- **Tipo**: Definición de esquema
- **Responsabilidad**: 
  - Modelos de base de datos (36 modelos)
  - Configuración de datasource (MySQL)
  - Generator config (output personalizado)

### Tecnologías y Herramientas

| Capa | Tecnología | Versión | Propósito |
|------|-----------|---------|-----------|
| **Frontend** | Next.js | 16.1.2 | Framework React con App Router |
| **Frontend** | React | 19.2.3 | Biblioteca UI |
| **Frontend** | TypeScript | ^5 | Tipado estático |
| **Frontend** | TailwindCSS | ^4 | Estilos utility-first |
| **Backend** | Next.js API Routes | 16.1.2 | Endpoints REST |
| **ORM** | Prisma | 6.19.2 | ORM TypeScript |
| **Base de Datos** | MySQL | - | Base de datos relacional |
| **Herramientas** | ESLint | ^9 | Linter de código |
| **Config** | PostCSS | - | Procesamiento de CSS |

### Patrones de Diseño

1. **Singleton Pattern**: `src/lib/prisma.ts` - Una instancia única de PrismaClient
2. **Client Component Pattern**: `app/(ui)/page.tsx` - Componente con estado del lado del cliente
3. **API Route Pattern**: `app/api/projects/route.ts` - Endpoints REST en Next.js
4. **Debounce Pattern**: Búsqueda optimizada con delay de 300ms
5. **Separation of Concerns**: Frontend, Backend y Base de Datos separados
6. **Layered Architecture**: Preparado para servicios, repositorios y validadores (futuro)

### Arquitectura Escalable

La estructura actual soporta crecimiento futuro:

- **Servicios** (`src/services/`): Lógica de negocio compleja (transformaciones, validaciones avanzadas)
- **Repositorios** (`src/repositories/`): Abstracción de consultas Prisma para reutilización
- **Validadores** (`src/validators/`): Validación de query params con Zod (mejorar validaciones actuales)
- **Tipos** (`src/types/`): DTOs y tipos compartidos entre frontend y backend

**Endpoints actuales:**
- ✅ `/api/projects` - Búsqueda por prefijo (autocomplete)
- ✅ `/api/zones` - Catálogo de zonas
- ✅ `/api/categories` - Catálogo de categorías  
- ✅ `/api/records` - Resultados filtrados con paginación

**Futuras extensiones posibles:**
- Nuevos filtros (ej. por estado, por fecha)
- Endpoints de detalle (ej. `/api/projects/[id]`)
- Exportación de resultados (CSV, Excel)
- Búsqueda avanzada con múltiples criterios

### Convenciones de Código

- **Archivos TypeScript**: Extensión `.ts` para utilidades, `.tsx` para componentes React
- **Rutas API**: Ubicadas en `app/api/[nombre]/route.ts`
- **Componentes**: Client Components con `"use client"` directive
- **Route Groups**: `(ui)` para organizar páginas sin afectar URLs
- **Código Fuente**: `src/` contiene toda la lógica del proyecto (lib, services, repos, etc.)
- **Archivos Generados**: `generated/` contiene Prisma client (no modificar)
- **Tipos**: Interfaces definidas en el mismo archivo o en `src/types/`
- **Estilos**: Tailwind CSS con clases utility-first
- **Naming**: camelCase para variables/funciones, PascalCase para componentes/tipos
- **Path Aliases**: `@/*` apunta a raíz, `@/src/*` apunta a `src/`
