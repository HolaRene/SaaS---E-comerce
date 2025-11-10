import { Comercio, Producto } from "@/types/tipado_comercio";

const infoLegal={
    NIT:'J0310000123456',
    RUC:'123-456789-0001A',
    direccion:'Boaco, del parque central 1c. al este.',
    moneda: 'NIO',
    whatsapp:true,
    backup: 'ayer en la noche de ayer'
}
const horariosRegulares = [
    { dia: "Lunes", apertura: "07:00", cierre: "20:00" },
    { dia: "Martes", apertura: "07:00", cierre: "20:00" },
    { dia: "Miércoles", apertura: "07:00", cierre: "20:00" },
    { dia: "Jueves", apertura: "07:00", cierre: "20:00" },
    { dia: "Viernes", apertura: "07:00", cierre: "20:00" },
    { dia: "Sábado", apertura: "07:00", cierre: "20:00" },
    { dia: "Domingo", apertura: "", cierre: "" },
]
export const productos:Producto[] = [
    {
    id: 'nm',
    nombre: "Wireless Bluetooth Headphones - Premium Sound Quality",
    precio: 79.99,
    categoria:['guaro'],
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
   
},
{
    id: 'nm1',
    nombre: "Wireless Bluetooth Headphones - Premium Sound Quality",
    precio: 79.99,
    categoria:['guaro'],
    stock:30,
    codigoBarras:'mmmmm',
    imagen: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop",
    ],
    puntuacion: 4.5,
    vistasTotales: 1247,
    venta: {
        nombre: "TechGear Pro",
        avatar: '',
        direccion: 'de alla para pacuya',
    },
    estado:'agotado',
    inStock: true,
    
    descripcion:
        "Experience premium audio quality with our wireless Bluetooth headphones. Featuring advanced noise cancellation technology and exceptional battery life, these headphones are perfect for music lovers and professionals alike.",
   
},{
    id: 'nm2',
    nombre: "Pan flexis",
    precio: 79.99,
    categoria:['Panadería'],
    stock:30,
    codigoBarras:'mmmmm',
    imagen: [
        "https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop",
    ],
    puntuacion: 4.5,
    vistasTotales: 1247,
    venta: {
        nombre: "TechGear Pro",
        avatar: '',
        direccion: 'de alla para pacuya',
    },
    estado:'disponible',
    inStock: true,
    
    descripcion:
        "Experience premium audio quality with our wireless Bluetooth headphones. Featuring advanced noise cancellation technology and exceptional battery life, these headphones are perfect for music lovers and professionals alike.",
   
}
]

export const cajActual={
        id: "1",
        nombre: "José Espinoza",
        rol: "cajero"
    }

// export const tiendas:Comercio[] =[
//     {
//         id:'don',
//         avatar: 'https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg',
//         imgBanner:'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg',
//         nombre: 'Primer tienda',
//         direccion:'llegando a pacuya',
//         departamento: 'Boaco',
//         categoria:'pulperia',
//         descripcion: 'el  mero don esta llegando a pacuya',
//         estado: 'activa',
//         lat: 12.34344,
//         lng: 12.5454,
//         propietario: 'donjoe',
//         puntuacion: 3.5,
//         telefono: '505 88888888',
//         configuracion: infoLegal,
//         ventasHoy:23344,
//         horarios:horariosRegulares
//     },
        
//     {
//         id:'don1',
//         avatar: 'https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg',
//     imgBanner:'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg',
//         nombre: 'segunda tienda',
//         direccion:'llegando a pacuya',
//         departamento: 'Boaco',
//         categoria:'pulperia',
//         descripcion: 'el  mero don esta llegando a pacuya',
//         estado: 'activa',
//         lat: 12.34344,
//         lng: 12.5454,
//         propietario: 'donjoe',
//         puntuacion: 3.5,
//         configuracion: infoLegal,
//         telefono: '505 88888888',
//         ventasHoy:23344,
//     horarios:horariosRegulares
//     },
        
// ]

export const tienda: Comercio={
    id:'don1',
    avatar: 'https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg',
    imgBanner:'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg',
    nombre: 'segunda tienda',
    direccion:'llegando a pacuya',
    departamento: 'Boaco',
    categoria:'pulperia',
    descripcion: 'el  mero don esta llegando a pacuya',
    estado: 'inactiva',
    lat: 12.34344,
    lng: 12.5454,
    propietario: 'donjoe',
    puntuacion: 3.5,
    telefono: '505 88888888',
    ventasHoy:23344,
    configuracion: infoLegal,
    horarios:horariosRegulares,
    productos:productos,
    resenas:[{
        id: 'string',
        autor: 'donjuan',
        avatar: 'joj',
        rating: 4.5,
        comentario: 'QUe mierda mas mala',
        fecha: '01/03/24',
        verificada: true
    },{
        id: 'string',
        autor: 'donjuan',
        avatar: 'joj',
        rating: 4.5,
        comentario: 'QUe mierda mas mala',
        fecha: '01/03/24',
        verificada: true
    }]
 }

//  Datos de categorias
export const categoriasData = [
    { id: 'cat1', nombre: 'Panadería', subcategorias: ['Pan Dulce', 'Pan Baguette', 'Pan Integral'] },
    { id: 'cat2', nombre: 'Bebidas', subcategorias: ['Gaseosas', 'Jugos', 'Agua'] },
    { id: 'cat3', nombre: 'Abarrotes', subcategorias: ['Granos Básicos', 'Enlatados', 'Aceites'] },
    { id: 'cat4', nombre: 'Limpieza', subcategorias: ['Detergentes', 'Desinfectantes'] },
];