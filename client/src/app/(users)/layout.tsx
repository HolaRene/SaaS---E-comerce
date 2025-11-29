import type { Metadata } from "next";
import "./user/users.css";


export const metadata: Metadata = {
    title: "Usuario",
    description: "Sección de usuario",
};

export default function UsersLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
