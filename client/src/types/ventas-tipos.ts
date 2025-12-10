// Tipados mejorados
export interface Producto {
    id: string;
    nombre: string;
    categoria: string[];
    precio: number;
    stock: number;
    imagen: string[];
    puntuacion: number;
    estado: 'agotado' | 'disponible';
    inStock: boolean;
}

export interface ProductoVenta {
    id: string;
    nombre: string;
    cantidad: number;
    precioUnitario: number;
    stockDisponible: number;
    imagen?: string;
}

export interface Cliente {
    id: string;
    nombre: string;
    email?: string;
    telefono?: string;
    direccion?: string;
    notas?: string;
    fechaRegistro: string;
}

export interface UsuarioCajero {
    id: string;
    nombre: string;
    rol: string;
}

export interface NuevoClienteForm {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    notas: string;
}