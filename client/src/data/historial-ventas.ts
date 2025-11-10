import { cajActual, productos } from "@/lib/tiendas-datos"
import { clientesData } from "./clientes-data"

//  se usa en el historial de ventas
export interface Venta {
    id: string
    fecha: string
    cliente: string
    monto: number
    metodoPago: string
    productos:string
    cajero:string
}

export const ventasCreadas:Venta[] = [
    {
        id:'01',
        productos: productos[0].nombre,
        cliente: clientesData[0].nombre,
        metodoPago:'efectivo',
        monto: 190,
        cajero: cajActual.nombre,
        fecha:"03/10/2025"
    },
    {
         id:'02',
        productos: productos[1].nombre,
        cliente: clientesData[1].nombre,
        metodoPago:'efectivo',
        monto: 19,
        cajero: cajActual.nombre,
        fecha:"03/10/2025"
    },
]