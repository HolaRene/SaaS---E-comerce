
import { ArrowLeft, } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Id } from "../../../../../convex/_generated/dataModel"
import ProductCard from "./_componenst/ProductoCard"


export default async function ProductDetailPage({ params }: { params: { id: Id<"productos"> } }) {
    const { id } = await params

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Results
                        </Button>
                        <div className="text-sm text-gray-600">Electronics &gt; Audio &gt; Headphones &gt; Wireless</div>
                    </div>
                </div>
            </header>
            <ProductCard id={id} />

        </div>
    )
}


