"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const nuevosComerciosData = [
    { month: "Ene", count: 8 },
    { month: "Feb", count: 12 },
    { month: "Mar", count: 9 },
    { month: "Abr", count: 15 },
    { month: "May", count: 10 },
    { month: "Jun", count: 14 },
];

const NuevosComercios = () => {
    return (


        <Card className="2xl:col-span-2">
            <CardHeader>
                <CardTitle>Nuevos Comercios por Mes</CardTitle>
                <CardDescription>Crecimiento de la base de comercios en los últimos 6 meses.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-64 w-full">
                    <BarChart data={nuevosComerciosData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis tickLine={false} axisLine={false} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Bar dataKey="count" fill="var(--chart-5)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default NuevosComercios