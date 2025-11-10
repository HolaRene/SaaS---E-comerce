
import { Producto } from "@/types/tipado_comercio";

export const actualizarProductosStockHistorial= (fecha:string,producto:Producto,unidad:number)=>{
  return `${fecha} se ha actualizado el Stock del producto ${producto.nombre} de ${producto.stock} a ${unidad}`
}
export const eliminarProductosHistorial= (fecha:string,producto:Producto,)=>{
  return `${fecha} se eliminó el producto ${producto.nombre}`
}
export const agregarProductosHistorial= (fecha:string,producto:Producto,)=>{
  return `02/10/2025 – Producto nuevo agregado: ${producto.nombre}.`
}



const y = '02/10/25'
const x:Producto= {
    id: 'nm',
    nombre: "Wireless Bluetooth Headphones - Premium Sound Quality",
    precio: 79.99,
    categoria:'guaro',
    stock:42,
    codigoBarras:'mmmmm',
    imagen: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop",
    ],
    puntuacion: 4.5,
    estado:'disponible',
    vistasTotales: 1247,
    venta: {
        nombre: "TechGear Pro",
        avatar: '',
        direccion: '',
    },
    inStock: true,
    
    descripcion:
        "Experience premium audio quality with our wireless Bluetooth headphones. Featuring advanced noise cancellation technology and exceptional battery life, these headphones are perfect for music lovers and professionals alike.",
   
}
export const productoActualizado = actualizarProductosStockHistorial(y,x,34 )
export const productoEliminado = eliminarProductosHistorial(y,x, )
export const productoagregar = agregarProductosHistorial(y,x, )
