
import { Id } from "../../../../../../convex/_generated/dataModel";
import ProductosClient from "./ProductosClient";

const ProductosPage = async ({ params }: { params: { idTienda: Id<"tiendas"> } }) => {
    const idTienda = (await params).idTienda;

    return (
        <ProductosClient idTienda={idTienda} />
    )
}

export default ProductosPage