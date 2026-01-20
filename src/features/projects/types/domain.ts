// Tipos del dominio de la aplicación

export interface Project {
  id: number;
  proyecto: string;
  categoria: string;
  zona: string | null;
  periodo: string;
  total_unidades: number | null;
  unidades_disponibles: number | null;
}

export interface SelectedProject {
  proyecto: string;
  categoria: string;
  zona: string | null;
}

export interface RecordDetails {
  proyecto: string;
  fase: string | null;
  torre: string | null;
  periodo: string;
  categoria: string;
  pais: string;
  departamento: string | null;
  municipio: string | null;
  zona: string | null;
  desarrollador: string | null;
  estado: string | null;
  fecha_inicio: string | null;
  fecha_entrega: string | null;
  total_unidades: number | null;
  unidades_disponibles: number | null;
  tipo_de_seguridad: string | null;
  precio_promedio: string | null;
  cuota_promedio: string | null;
  ingresos_promedio: string | null;
  cantidad_accesos: string | null;
  url_imagen: string | null;
  latitud: number | null;
  longitud: number | null;
}
