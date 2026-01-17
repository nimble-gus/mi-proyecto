# Mi Proyecto - Búsqueda de Proyectos

Aplicación fullstack desarrollada con Next.js y TypeScript que permite buscar proyectos por nombre.

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

### Búsqueda de Proyectos por Nombre

La aplicación permite buscar proyectos por nombre mediante una API REST que devuelve información filtrada.

#### Endpoint

**GET** `/api/projects?q=nombre_proyecto`

#### Parámetros de Consulta

- `q` (string, opcional): Término de búsqueda para filtrar por nombre de proyecto

#### Respuesta

La API devuelve un array de proyectos que coinciden con la búsqueda. Cada proyecto contiene los siguientes campos desde la tabla `housing_universe`:

```json
{
  "projects": [
    {
      "proyecto": "Nombre del Proyecto",
      "categoria": "Categoría",
      "zona": "Zona",
      "estado": "Estado"
    }
  ]
}
```

**Características de la búsqueda:**
- Búsqueda parcial (contiene) en el campo `proyecto`
- Máximo 20 resultados
- Ordenados alfabéticamente por nombre de proyecto
- Si `q` está vacío o no se proporciona, retorna `{ projects: [] }`

#### Frontend

El componente `app/page.tsx` contiene la interfaz del buscador implementada con las siguientes características:

**Funcionalidades:**
- ✅ Input controlado con búsqueda en tiempo real
- ✅ Debounce de 300ms para optimizar las peticiones
- ✅ Estados de carga ("Buscando…")
- ✅ Manejo de errores con mensajes claros
- ✅ Muestra resultados con los campos: `proyecto`, `categoria`, `zona`, `estado`
- ✅ Mensaje cuando no hay resultados
- ✅ Limpia resultados automáticamente cuando el input está vacío
- ✅ Diseño responsive con Tailwind CSS
- ✅ Soporte para modo oscuro

**Tecnologías:**
- React Hooks (`useState`, `useEffect`, `useCallback`)
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
2. ✅ Valida y limpia el término de búsqueda (trim)
3. ✅ Si `q` está vacío → retorna `{ projects: [] }`
4. ✅ Busca en la tabla `housing_universe` por el campo `proyecto` usando búsqueda parcial (`contains`)
5. ✅ Limita resultados a 20 y ordena por nombre ascendente
6. ✅ Selecciona únicamente: `proyecto`, `categoria`, `zona`, `estado`
7. ✅ Retorna formato JSON: `{ projects: [...] }`
8. ✅ Manejo de errores con status 500 y mensaje simple

### Frontend del Buscador

El archivo `app/page.tsx` contiene el componente del buscador implementado con:

1. ✅ **Tipos TypeScript bien definidos**: Interface `Project` con los campos exactos del backend
2. ✅ **Estados mínimos**: `query`, `projects`, `loading`, `error`
3. ✅ **Input controlado**: `value` y `onChange` correctamente implementados
4. ✅ **Llamada al backend**: Usa `fetch` con `encodeURIComponent` para la query
5. ✅ **Comportamiento con input vacío**: Limpia resultados sin hacer requests innecesarios
6. ✅ **Debounce**: Espera 300ms antes de disparar la búsqueda
7. ✅ **Render de estados**: Muestra loading, errores y "No hay resultados" correctamente
8. ✅ **Render de resultados**: Muestra los 4 campos definidos con manejo de valores null
9. ✅ **Buenas prácticas**: Sin credenciales, sin URLs absolutas, código limpio

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
8. ✅ Búsqueda funcional en tabla `housing_universe` por campo `proyecto`
9. ✅ Campos de respuesta definidos: `proyecto`, `categoria`, `zona`, `estado`
10. ✅ `app/page.tsx` - Frontend completo con búsqueda en tiempo real
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

3. Escribe en el campo de búsqueda y observa:
   - La búsqueda se ejecuta automáticamente después de 300ms
   - Muestra "Buscando…" mientras carga
   - Muestra los resultados con los campos: proyecto, categoria, zona, estado
   - Muestra "No hay resultados" si no encuentra coincidencias

### Probar el Endpoint Directamente

También puedes probar el endpoint directamente:

```bash
# Sin query (debe retornar { projects: [] })
GET http://localhost:3000/api/projects

# Query vacío (debe retornar { projects: [] })
GET http://localhost:3000/api/projects?q=

# Con término de búsqueda
GET http://localhost:3000/api/projects?q=nombre_proyecto
```

### Verificar en DBeaver

Puedes comparar los resultados con una consulta directa en DBeaver:

```sql
SELECT proyecto, categoria, zona, estado 
FROM housing_universe 
WHERE proyecto LIKE '%nombre_proyecto%' 
ORDER BY proyecto ASC 
LIMIT 20;
```
