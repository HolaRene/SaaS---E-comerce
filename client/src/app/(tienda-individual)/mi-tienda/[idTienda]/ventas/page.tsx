
import { Id } from "../../../../../../convex/_generated/dataModel";
import VentasClient from "./VentasClient";

export default async function VentasPage({ params }: { params: Promise<{ idTienda: Id<"tiendas"> }> }) {
    const { idTienda } = await params;

    return (
        <VentasClient idTienda={idTienda} />
    )
}
