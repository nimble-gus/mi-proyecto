// Tipos del dominio de la aplicación

export interface Project {
  id: number;
  proyecto: string;
  categoria: string;
  zona: string | null;
  periodo: string;
  total_unidades: number | null;
}

export interface SelectedProject {
  proyecto: string;
  categoria: string;
  zona: string | null;
}

export interface RecordDetails {
  id: number;
  cod_proyecto: string | null;
  fecha_recoleccion: string | null;
  proyecto: string;
  fase: string | null;
  torre: string | null;
  periodo: string;
  categoria: string;
  pais: string;
  departamento: string | null;
  municipio: string | null;
  zona: string | null;
  subzona: string | null;
  desarrollador: string | null;
  estado: string | null;
  uso: string | null;
  fecha_inicio: string | null;
  fecha_entrega: string | null;
  meses_de_comercializacion: number | null;
  latitud: string | null;
  longitud: string | null;
  fha: string | null;
  total_unidades: number | null;
  total_m2: string | null;
  tipo_de_seguridad: string | null;
  muvi: string | null;
  unidades_disponibles: number | null;
  m2_disponibles: string | null;
  precio_promedio: string | null;
  tamano_promedio: string | null;
  precio_prom_m2: string | null;
  cuota_promedio: string | null;
  ingresos_promedio: string | null;
  nse_proyecto: string | null;
  showroom: string | null;
  casa_modelo: string | null;
  cantidad_accesos: string | null;
  mercado: string;
  precio_parqueo_adicional: string | null;
  parqueos_visita: number | null;
  parqueos_asignados: number | null;
  total_parqueos_proyecto: number;
  url_imagen: string | null;
  mig_number: number | null;
  created_at: string;
}
