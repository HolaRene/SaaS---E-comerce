import { Id } from "../../../../../convex/_generated/dataModel";
import { Metadata } from "next";
import { ErrorBoundary } from "@/components/error/ErrorBoundery";
import MiNegocioClient from "./MiNegocioClient";

export const metadata: Metadata = {
    title: "Tu tienda flexi",
    description: "El mero don",
    icons: {
        icon: "/favicon-32x32.png",
    },
};

// --- Componente Principal (Server Component) ---
const MiNegocio = async ({ params }: { params: Promise<{ idTienda: Id<"tiendas"> }> }) => {

    const { idTienda: id } = await params
    return (
        <ErrorBoundary>
            <MiNegocioClient id={id} />
        </ErrorBoundary>
    );
}

export default MiNegocio
