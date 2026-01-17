# Mi Proyecto - Búsqueda de Proyectos

Aplicación fullstack desarrollada con Next.js y TypeScript que permite buscar proyectos por nombre.

## 🛠️ Stack Tecnológico

### Frontend & Backend
- **Next.js 16.1.2** - Framework React con App Router
- **TypeScript** - Tipado estático para frontend y backend
- **React 19.2.3** - Biblioteca para la interfaz de usuario
- **TailwindCSS** - Framework de CSS utility-first

### Base de Datos
- **Prisma 7.2.0** - ORM para TypeScript/Node.js
- **MySQL** - Sistema de gestión de base de datos relacional
- **DBeaver** - Herramienta de administración de base de datos

## 📁 Estructura del Proyecto

```
mi-proyecto/
├── app/
│   ├── page.tsx              # Frontend (buscador)
│   ├── api/
│   │   └── projects/
│   │       └── route.ts      # Backend (GET ?q=...)
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   └── prisma.ts             # PrismaClient singleton (pendiente)
├── app/
│   └── generated/
│       └── prisma/           # Cliente de Prisma generado
├── prisma/
│   └── schema.prisma         # Schema de Prisma (36 modelos importados)
├── prisma.config.ts          # Configuración de Prisma con DATABASE_URL
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

La API devuelve un array de proyectos que coinciden con la búsqueda. Cada proyecto contiene **3 campos** (a definir posteriormente en el schema de Prisma).

Ejemplo de respuesta:

```json
{
  "projects": [
    {
      "campo1": "valor1",
      "campo2": "valor2",
      "campo3": "valor3"
    }
  ]
}
```

#### Frontend

El componente `app/page.tsx` contiene la interfaz del buscador que permite:
- Ingresar el nombre del proyecto a buscar
- Realizar la búsqueda mediante el endpoint de la API
- Mostrar los resultados de la búsqueda

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

> **Nota:** En Prisma 7, la URL de la base de datos se configura en `prisma.config.ts`, no en el `schema.prisma`.

4. Configurar Prisma con MySQL:

El archivo `prisma/schema.prisma` ya está configurado para usar MySQL:

```prisma
datasource db {
  provider = "mysql"
}
```

La URL de conexión se lee desde `prisma.config.ts` que utiliza la variable de entorno `DATABASE_URL`.

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

- ✅ Conexión a MySQL configurada (`prisma.config.ts` y `.env`)
- ✅ Schema de Prisma importado desde la base de datos (36 modelos)
- ✅ Cliente de Prisma generado
- ✅ Dependencias instaladas (incluyendo `dotenv` para `prisma.config.ts`)

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

El archivo `lib/prisma.ts` (pendiente de crear) exportará una instancia singleton de PrismaClient para evitar múltiples conexiones en desarrollo con hot-reload de Next.js. El cliente generado se encuentra en `app/generated/prisma`.

**Nota sobre Prisma 7:** En esta versión, la configuración de la conexión se realiza en `prisma.config.ts` en lugar del `schema.prisma`, y el cliente se genera en una ubicación personalizada mediante el `generator client`.

### Endpoint de Búsqueda

El archivo `app/api/projects/route.ts` contiene la lógica del endpoint GET que:
1. Recibe el parámetro de consulta `q`
2. Realiza la búsqueda en la base de datos usando Prisma
3. Devuelve los resultados en formato JSON

### Frontend del Buscador

El archivo `app/page.tsx` contiene el componente del buscador que:
1. Maneja el estado del input de búsqueda
2. Realiza peticiones a la API cuando el usuario busca
3. Muestra los resultados obtenidos

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta ESLint

## 📋 Estado del Proyecto

### ✅ Completado

1. ✅ Estructura del proyecto configurada (Next.js + TypeScript)
2. ✅ Prisma instalado y configurado para MySQL
3. ✅ Conexión a la base de datos establecida
4. ✅ Schema importado desde MySQL (36 modelos, incluyendo `Projects`)
5. ✅ Cliente de Prisma generado en `app/generated/prisma`

### 🚧 Próximos Pasos

1. **Crear instancia de PrismaClient** (`lib/prisma.ts`)
   - Implementar singleton para evitar múltiples conexiones en desarrollo
   - Configurar para usar el cliente generado desde `app/generated/prisma`

2. **Implementar endpoint de búsqueda** (`app/api/projects/route.ts`)
   - Crear ruta GET que reciba el parámetro `q` (query)
   - Buscar proyectos por nombre usando `project_name` del modelo `Projects`
   - Retornar 3 campos específicos (a definir) en formato JSON

3. **Desarrollar interfaz de búsqueda** (`app/page.tsx`)
   - Crear componente de búsqueda con input
   - Conectar con el endpoint `/api/projects?q=...`
   - Mostrar resultados de la búsqueda

4. **Definir campos de respuesta**
   - Seleccionar los 3 campos específicos que se retornarán en la búsqueda
   - Actualizar la documentación del endpoint

5. **Pruebas y validación**
   - Probar búsqueda con diferentes términos
   - Validar manejo de errores
   - Verificar formato de respuesta
