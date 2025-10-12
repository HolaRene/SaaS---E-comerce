"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const ingresosTotalesData = [
    { month: "Ene", revenue: 82000 },
    { month: "Feb", revenue: 97000 },
    { month: "Mar", revenue: 103000 },
    { month: "Abr", revenue: 110000 },
    { month: "May", revenue: 117000 },
    { month: "Jun", revenue: 125000 },
];

const IngresosTotales = () => {
    return (
        <Card className="2xl:col-span-2">
            <CardHeader>
                <CardTitle>Ingresos Totales (MRR)</CardTitle>
                <CardDescription>Evolución de los ingresos mensuales recurrentes.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-64 w-full">
                    <AreaChart data={ingresosTotalesData}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--chart-5)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis tickFormatter={(value) => `C$${Number(value) / 1000}k`} tickLine={false} axisLine={false} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="var(--chart-5)" fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default IngresosTotales