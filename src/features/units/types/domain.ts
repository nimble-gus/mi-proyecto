// Tipos del dominio de unidades

export interface Unit {
  id: number;
  num_unidad: string | null;
  modelo: string | null;
  torre_fase: string | null;
  unidad: string | null;
  uso: string | null;
  disponibilidad: string | null;
  cant_dormitorios: number | null;
  precio_total_usd: number | null;
  precio_total_qtz: number | null;
  tama_o_unidad: number | null;
}

export interface UnitDetails {
  proyecto: string;
  unidad: string | null;
  periodo: string | null;
  modelo: string | null;
  torre_fase: string | null;
  tama_o_unidad: number | null;
  tama_o_balcon_terraza: number | null;
  cant_dormitorios: number | null;
  cant_sanitarios: number | null;
  parqueo: string | null;
  tipo_parqueo: string | null;
  cant_parqueos: number | null;
  parqueo_moto: string | null;
  tama_o_parqueo: number | null;
  tama_o_total: number | null;
  uso: string | null;
  precio_total_usd: number | null;
  precio_total_qtz: number | null;
  precio_sin_iva_usd: number | null;
  precio_sin_iva_qtz: number | null;
  disponibilidad: string | null;
  precio_mantenimiento_total: number | null;
  categoria: string | null;
  hora_recoleccion: string | null;
  cuota: number | null;
  absorcion_unitaria: number | null;
}

export interface UnitsCatalogs {
  uses: string[];
  availabilities: string[];
  bedrooms: number[];
}
