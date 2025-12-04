
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import ProductCard from "./_componenst/ProductoCard"
import { Id } from "../../../../../../convex/_generated/dataModel"


export default async function ProductDetailPage({ params }: { params: { id: Id<"productos"> } }) {
    const { id } = await params

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <header className="bg-white border-b sticky top-0 z-1">
                <div className="container mx-auto px-4 py-3">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/user/productos">Productos</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Detalles</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <ProductCard id={id} />

        </div>
    )
}


