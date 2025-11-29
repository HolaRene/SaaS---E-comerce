import { redirect } from "next/navigation";

export default function Page() {
    // Redirige server-side a /user/dashboard para evitar render del layout cliente
    redirect("/user/dashboard");
}
