import type { Metadata } from "next";



export const metadata: Metadata = {
    title: "Usuario",
    description: "Sección de usuario",
};

export default function UsersLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
