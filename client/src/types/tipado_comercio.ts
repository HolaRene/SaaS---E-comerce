// Tipos únicos para tod el SaaS

export type ISODate = string;
export type EstadoComercio = "activa" | "inactiva" | "mantenimiento";

export interface Comercio {
  id: string;
  avatar: string
  imgBanner:string
  nombre: string;
  categoria: CategoriaComercio;
  descripcion: string;
  direccion: string;
  lat: number;
  lng: number;
  puntuacion: number; // 0 a 5
  telefono: string;
  propietario: string;
  estado: EstadoComercio;
  ventasHoy: number; 
  departamento?: string; // opcional, pero recomendado
  configuracion: {NIT:string,RUC:string, direccion:string, moneda:string, whatsapp:boolean, backup:string}
  horarios:{ dia:string, apertura: string, cierre: string }[],
  productos:Producto[]
  resenas:Resena[]
}

export interface Producto {
  id: string;
  nombre: string;
  categoria: string [];
  precio: number;
  stock: number;
  imagen: string[];
  puntuacion:number;
  vistasTotales:number;
  descripcion: string;
  estado: 'agotado'| 'disponible';
  venta:{nombre:string,avatar:string,direccion:string}
  codigoBarras?: string;
  inStock:boolean
}


export interface VentasResumen {
  ventasHoy: number;        // C$
  ventasMes: number;        // C$
  clientesNuevos: number;   // #
  promocionesActivas: number;
  productosVendidos: Array<{ nombre: string; cantidad: number; ventas: number }>;
  ventasPorCategoria: Array<{ categoria: string; ventas: number }>;
}

export type UserRole = "admin" | "vendedor" | "propietario";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  role: UserRole;
  avatar?: string;
  telefono?: string;
  comercioId?: string; // si es propietario
  creadoEl: ISODate;
  ultimoAcceso: ISODate;
}


// --- Clientes ---
export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  fechaRegistro: ISODate; // ISO
  totalCompras: number;   // C$ acumulado
}


export type CategoriaComercio =
  | "pulperia"
  | "farmacia"
  | "distribuidora"
  | "panaderia"
  | "ferreteria";

export interface FiltrosComercio {
  departamento: string;
  categoria: "" | CategoriaComercio;
  puntuacionMinima: number;
  busqueda: string;
}

// src/types/reseña.ts
export interface Resena {
  id: string;
  autor: string;
  avatar: string;
  rating: number;
  comentario: string;
  fecha: string;       // 👈 mejor manejarlo como Date directamente
  verificada: boolean;
}

// Historial de eventos
export type TipoEvento = 
  | 'STOCK_ACTUALIZADO' 
  | 'PRODUCTO_AGREGADO' 
  | 'PRODUCTO_ELIMINADO'
  | 'PRECIO_ACTUALIZADO'
  | 'PRODUCTO_EDITADO';

export interface EventoHistorial {
  tipo: TipoEvento;
  productoId: string;
  productoNombre: string;
  fecha: Date;
  metadata?: {
    stockAnterior?: number;
    stockNuevo?: number;
    precioAnterior?: number;
    precioNuevo?: number;
    cambios?: Partial<Producto>;
  };
}

export interface EntradaHistorial {
  fecha: string;
  mensaje: string;
}

