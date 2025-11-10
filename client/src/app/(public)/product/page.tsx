"use client";

import { useState } from "react";
import { Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import Image from "next/image";

// Mock data
const categories = ["Electrónica", "Ropas", "Casa y jardín", "Deporte", "Libros", "Juguetes", "Bellesa", "Vehiculos"];

const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: 79.99,
        originalPrice: 99.99,
        image: "https://images.pexels.com/photos/3394656/pexels-photo-3394656.jpeg?w=400&h=400&fit=crop",
        rating: 4.5,
        reviews: 1247,
        seller: "TechGear Pro",
        trustScore: 92,
        category: "Electronics",
    },
    {
        id: 2,
        name: "Premium Cotton T-Shirt",
        price: 24.99,
        image: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?w=400&h=400&fit=crop",
        rating: 4.3,
        reviews: 856,
        seller: "Fashion Forward",
        trustScore: 85,
        category: "Clothing",
    },
    {
        id: 3,
        name: "Smart Home Security Camera",
        price: 149.99,
        originalPrice: 199.99,
        image: "https://images.pexels.com/photos/3992870/pexels-photo-3992870.jpeg?w=400&h=400&fit=crop",
        rating: 4.7,
        reviews: 2103,
        seller: "SecureHome Tech",
        trustScore: 96,
        category: "Electronics",
    },
    {
        id: 4,
        name: "Organic Coffee Beans 2lb",
        price: 18.99,
        image: "https://images.pexels.com/photos/585750/pexels-photo-585750.jpeg?w=400&h=400&fit=crop",
        rating: 4.6,
        reviews: 743,
        seller: "Mountain Roasters",
        trustScore: 89,
        category: "Food",
    },
    {
        id: 5,
        name: "Yoga Mat Premium Quality",
        price: 39.99,
        image: "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?w=400&h=400&fit=crop",
        rating: 4.4,
        reviews: 512,
        seller: "FitLife Essentials",
        trustScore: 83,
        category: "Sports",
    },
    {
        id: 6,
        name: "LED Desk Lamp with USB Charging",
        price: 34.99,
        originalPrice: 49.99,
        image: "https://images.pexels.com/photos/8092810/pexels-photo-8092810.jpeg?w=400&h=400&fit=crop",
        rating: 4.2,
        reviews: 328,
        seller: "Office Solutions",
        trustScore: 78,
        category: "Home & Garden",
    },
];


function ProductCard({ product }: { product: (typeof products)[0] }) {
    return (
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4">
                <div className="relative mb-3">
                    <Link href={`/product/${product.id}`}>
                        <Image src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md" width={192} height={192} />
                    </Link>
                    {product.originalPrice && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                            Guardar ${(product.originalPrice - product.price).toFixed(2)}
                        </Badge>
                    )}
                </div>

                <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h3>

                <div className="flex items-center mb-2">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                        ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-1">({product.reviews})</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                    {product.originalPrice && <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>}
                </div>

                <div className="text-xs text-gray-600 mb-3">
                    by <span className="text-blue-600 hover:underline">{product.seller}</span>
                </div>


                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">Agregar al carrito</Button>
            </CardContent>
        </Card>
    );
}

export default function BuyerHomepage() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState([0, 200]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleCategoryChange = (category: string, checked: boolean) => {
        setSelectedCategories(checked ? [...selectedCategories, category] : selectedCategories.filter((c) => c !== category));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar Filters */}
            <aside
                className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-white border-r p-6 overflow-y-auto transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    }`}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Filtros</h3>
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(false)}>
                        ✕
                    </Button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                    <h4 className="font-medium mb-3">Categorías</h4>
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <div key={category} className="flex items-center space-x-2">
                                <Checkbox
                                    id={category}
                                    checked={selectedCategories.includes(category)}
                                    onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                                />
                                <label htmlFor={category} className="text-sm">
                                    {category}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                    <h4 className="font-medium mb-3">Rango del precio</h4>
                    <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={10} className="mb-2" />
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                    </div>
                </div>



                {/* Seller Rating */}
                <div>
                    <h4 className="font-medium mb-3">Puntuación del vendedor</h4>
                    <div className="space-y-2">
                        {[4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center space-x-2">
                                <Checkbox id={`rating-${rating}`} />
                                <label htmlFor={`rating-${rating}`} className="flex items-center text-sm">
                                    <div className="flex">
                                        {[...Array(rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <span className="ml-1">& mejor</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Overlay (for mobile) */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                {/* Header Controls */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Detalles de los Productos</h2>
                    <div className="flex items-center gap-4 flex-col md:flex-row">
                        <Button variant="outline" size="sm" className="md:hidden" onClick={() => setSidebarOpen(true)}>
                            <Filter className="w-4 h-4 mr-1" /> Filters
                        </Button>
                        <select className="border rounded-md px-3 py-1 text-sm">
                            <option>Precio: Menor a mayor</option>
                            <option>Precio: Mayor a menor</option>
                            <option>Puntuación de las tiendas</option>

                        </select>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="text-center mt-8">
                    <Button variant="outline" className="px-8">
                        Cargar más productos
                    </Button>
                </div>
            </main>
        </div>
    );
}
