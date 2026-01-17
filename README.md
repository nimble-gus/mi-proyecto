# Mi Proyecto - Selector de Proyectos

Aplicación fullstack desarrollada con Next.js y TypeScript que permite seleccionar proyectos mediante un componente autocomplete/selector que busca por letra o prefijo.

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
│   ├── page.tsx              # Frontend (buscador) ✅
│   ├── api/
│   │   └── projects/
│   │       └── route.ts      # Backend (GET ?q=...) ✅
│   ├── generated/
│   │   └── prisma/           # Cliente de Prisma generado
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   └── prisma.ts             # PrismaClient singleton ✅
├── prisma/
│   └── schema.prisma         # Schema de Prisma (36 modelos importados)
├── prisma.config.ts          # Configuración de Prisma (opcional)
├── .env                      # Variables de entorno
├── package.json
└── README.md
```

## 🎯 Funcionalidad Principal

### Selector de Proyectos (Autocomplete)

La aplicación implementa un componente selector/autocomplete que permite buscar y seleccionar proyectos por letra o prefijo mediante una API REST.

#### Endpoint

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

#### Frontend - Selector/Autocomplete

El componente `app/page.tsx` contiene un selector de proyectos implementado con las siguientes características:

**Funcionalidades:**
- ✅ Campo selector con dropdown que se abre al escribir
- ✅ Búsqueda por letra o prefijo con debounce de 300ms
- ✅ Muestra solo la primera palabra en la lista (o primera + segunda si hay duplicados)
- ✅ Estados de carga ("Buscando…") y mensajes informativos
- ✅ Manejo de errores con mensajes claros
- ✅ Selección de proyecto que deshabilita el input y muestra el proyecto seleccionado
- ✅ Botón "Limpiar" para resetear la selección
- ✅ Cierra el dropdown al hacer click fuera
- ✅ Mensajes de estado: "Escribe para buscar…", "No hay coincidencias"
- ✅ Diseño responsive con Tailwind CSS
- ✅ Soporte para modo oscuro

**Tecnologías:**
- React Hooks (`useState`, `useEffect`, `useCallback`, `useRef`)
- TypeScript con tipos bien definidos
- Fetch API para comunicación con el backend

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

### Endpoint de Búsqueda

El archivo `app/api/projects/route.ts` contiene la lógica del endpoint GET implementada:

1. ✅ Lee el parámetro de consulta `q` desde la URL
2. ✅ Normaliza el input (trim) y valida longitud máxima (50 caracteres)
3. ✅ Si `q` está vacío → retorna `{ projects: [] }`
4. ✅ Busca en la tabla `housing_universe` por el campo `proyecto` usando búsqueda por prefijo (`startsWith`)
5. ✅ Limita resultados a 30 y ordena alfabéticamente por nombre
6. ✅ Selecciona únicamente 3 campos: `proyecto`, `categoria`, `zona`
7. ✅ Retorna formato JSON: `{ projects: [...] }`
8. ✅ Manejo de errores con status 500 y mensaje simple (sin exponer detalles sensibles)

### Frontend - Selector/Autocomplete

El archivo `app/page.tsx` contiene el componente selector implementado con:

1. ✅ **Tipos TypeScript bien definidos**: Interface `Project` con solo 3 campos (`proyecto`, `categoria`, `zona`)
2. ✅ **Estados del selector**: `query`, `options`, `isOpen`, `selected`, `loading`, `error`
3. ✅ **Input controlado**: Campo selector que se deshabilita al seleccionar un proyecto
4. ✅ **Llamada al backend**: Solo llama si `query` tiene 1+ letras, usa `fetch` con `encodeURIComponent`
5. ✅ **Regla de búsqueda**: Si `query` vacío → `options = []` y no hace request
6. ✅ **Debounce**: Espera 300ms antes de disparar la búsqueda
7. ✅ **Mostrar primera palabra**: Muestra la primera palabra en la lista, o primera + segunda si hay duplicados
8. ✅ **Interacción**: Click en opción selecciona, cierra dropdown y limpia opciones
9. ✅ **Botón limpiar**: Permite resetear la selección
10. ✅ **Cerrar dropdown**: Se cierra al hacer click fuera (usando `useRef` y event listeners)
11. ✅ **UX mejorada**: Mensajes de estado claros ("Escribe para buscar…", "Buscando…", "No hay coincidencias")
12. ✅ **Buenas prácticas**: Sin credenciales, sin URLs absolutas, código limpio

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
5. ✅ Cliente de Prisma generado en `app/generated/prisma`
6. ✅ `lib/prisma.ts` - Singleton de PrismaClient implementado
7. ✅ `app/api/projects/route.ts` - Endpoint GET `/api/projects` implementado
8. ✅ Búsqueda funcional en tabla `housing_universe` por campo `proyecto` usando prefijo (`startsWith`)
9. ✅ Campos de respuesta definidos: `proyecto`, `categoria`, `zona` (3 campos)
10. ✅ `app/page.tsx` - Frontend completo con selector/autocomplete
11. ✅ Búsqueda por prefijo implementada (1 letra o más)
12. ✅ Límite de 30 resultados para optimizar rendimiento
11. ✅ Debounce implementado (300ms)
12. ✅ Manejo de estados (loading, error, resultados vacíos)
13. ✅ Diseño responsive con Tailwind CSS
14. ✅ TypeScript con tipos bien definidos

### 🎉 Proyecto Listo para Usar

El proyecto está completamente funcional. Puedes:
- Iniciar el servidor con `npm run dev`
- Acceder a [http://localhost:3000](http://localhost:3000)
- Buscar proyectos por nombre en tiempo real
- Ver resultados con los campos: proyecto, categoria, zona, estado

## 🧪 Probar la Aplicación

### Desde el Navegador (Recomendado)

1. Inicia el servidor:
   ```bash
   npm run dev
   ```

2. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

3. Escribe en el selector y observa:
   - El dropdown se abre automáticamente al escribir
   - La búsqueda se ejecuta después de 300ms (debounce)
   - Muestra "Buscando…" mientras carga
   - Muestra opciones con la primera palabra del nombre de proyecto
   - Al seleccionar, muestra el proyecto completo arriba del selector
   - Botón "Limpiar" para resetear la selección

### Probar el Endpoint Directamente

También puedes probar el endpoint directamente:

```bash
# Sin query (debe retornar { projects: [] })
GET http://localhost:3000/api/projects

# Query vacío (debe retornar { projects: [] })
GET http://localhost:3000/api/projects?q=

# Una letra (debe retornar hasta 30 resultados)
GET http://localhost:3000/api/projects?q=a

# Prefijo (debe retornar hasta 30 resultados más específicos)
GET http://localhost:3000/api/projects?q=al
```

### Verificar en DBeaver

Puedes comparar los resultados con una consulta directa en DBeaver:

```sql
-- Búsqueda por prefijo (equivalente a startsWith)
SELECT proyecto, categoria, zona 
FROM housing_universe 
WHERE proyecto LIKE 'a%'  -- Reemplaza 'a' con tu prefijo
ORDER BY proyecto ASC 
LIMIT 30;
```

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
mi-proyecto/
├── app/                                    # Directorio principal de Next.js App Router
│   ├── api/                                # API Routes (Backend)
│   │   └── projects/                       # Endpoint de proyectos
│   │       └── route.ts                    # GET /api/projects - Búsqueda por prefijo
│   │
│   ├── generated/                          # Archivos generados (no modificar)
│   │   └── prisma/                         # Cliente de Prisma generado
│   │       ├── client.ts                   # PrismaClient export
│   │       ├── browser.ts                  # Cliente para browser
│   │       ├── enums.ts                    # Enumeraciones de Prisma
│   │       ├── models/                     # Modelos TypeScript generados
│   │       │   ├── housing_universe.ts     # Modelo housing_universe
│   │       │   ├── Projects.ts             # Modelo Projects
│   │       │   └── ... (36 modelos en total)
│   │       ├── models.ts                   # Export de todos los modelos
│   │       └── internal/                   # Archivos internos de Prisma
│   │
│   ├── page.tsx                            # Página principal (Selector/Autocomplete)
│   ├── layout.tsx                          # Layout raíz de la aplicación
│   ├── globals.css                         # Estilos globales con Tailwind CSS
│   └── favicon.ico                         # Favicon de la aplicación
│
├── lib/                                    # Utilidades y helpers
│   └── prisma.ts                           # Singleton de PrismaClient
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
│  app/page.tsx   │ ◄─── Frontend: Componente Selector/Autocomplete
│                 │      - Estados: query, options, isOpen, selected
│  Debounce 300ms │      - Lógica de primera palabra
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
└────────┬────────┘
         │
         │ prisma.housing_universe.findMany()
         ▼
┌─────────────────┐
│  lib/prisma.ts  │ ◄─── Singleton de PrismaClient
│                 │      - Evita múltiples conexiones
└────────┬────────┘
         │
         │ Prisma ORM
         ▼
┌─────────────────┐
│ app/generated/  │ ◄─── Cliente de Prisma generado
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

#### 1. Frontend (`app/page.tsx`)
- **Tipo**: Componente React Client Component
- **Responsabilidad**: Interfaz del selector/autocomplete
- **Estado**: 
  - `query`: Texto ingresado por el usuario
  - `options`: Array de proyectos del backend (máx 30)
  - `isOpen`: Estado del dropdown
  - `selected`: Proyecto seleccionado
  - `loading`: Estado de carga
  - `error`: Manejo de errores

#### 2. Backend API (`app/api/projects/route.ts`)
- **Tipo**: Next.js API Route Handler
- **Método**: GET
- **Responsabilidad**: 
  - Recibir query param `q`
  - Validar y normalizar input
  - Consultar base de datos con Prisma
  - Retornar hasta 30 resultados

#### 3. Prisma Client (`lib/prisma.ts`)
- **Tipo**: Singleton utility
- **Responsabilidad**: 
  - Instanciar PrismaClient una sola vez
  - Reutilizar en desarrollo (hot-reload)
  - Configurar logs según entorno

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

1. **Singleton Pattern**: `lib/prisma.ts` - Una instancia única de PrismaClient
2. **Client Component Pattern**: `app/page.tsx` - Componente con estado del lado del cliente
3. **API Route Pattern**: `app/api/projects/route.ts` - Endpoints REST en Next.js
4. **Debounce Pattern**: Búsqueda optimizada con delay de 300ms
5. **Separation of Concerns**: Frontend, Backend y Base de Datos separados

### Convenciones de Código

- **Archivos TypeScript**: Extensión `.ts` para utilidades, `.tsx` para componentes React
- **Rutas API**: Ubicadas en `app/api/[nombre]/route.ts`
- **Componentes**: Client Components con `"use client"` directive
- **Tipos**: Interfaces definidas en el mismo archivo o tipos inline
- **Estilos**: Tailwind CSS con clases utility-first
- **Naming**: camelCase para variables/funciones, PascalCase para componentes/tipos
