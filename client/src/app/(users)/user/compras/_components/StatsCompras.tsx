"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Package } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import * as React from "react";

const StatsCompras = () => {
    const { user: clerkUser } = useUser();

    // Fetch Convex user document
    const usuario = useQuery(
        api.users.getUserById,
        clerkUser ? { clerkId: clerkUser.id } : "skip"
    );

    // Fetch purchases for the user
    const compras = useQuery(
        api.compras.getComprasByUsuario,
        usuario?._id ? { usuarioId: usuario._id } : "skip"
    );

    // Calculate stats based on purchases
    const orderStats = React.useMemo(() => {
        const totalOrders = compras?.length || 0;
        const pendingOrders = compras?.filter(c => c.estado === "pendiente").length || 0;
        const totalSpent = compras?.reduce((sum, c) => sum + c.total, 0) || 0;

        return [
            { label: "Total de Compras", value: totalOrders, icon: Package },
            { label: "Compras Pendientes", value: pendingOrders, icon: Clock },
            { label: "Total gastado", value: totalSpent, icon: CheckCircle },
        ];
    }, [compras]);

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {orderStats.map((stat) => (
                <Card key={stat.label}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default StatsCompras;