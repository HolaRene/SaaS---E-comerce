import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Usuario",
    description: "Sección de usuario",
    icons: {
        icon: "/icons/usuario.png",
    },
};

export default function Layout({ children }) {
    return children;
}
