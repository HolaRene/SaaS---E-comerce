"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Users, DollarSign, TrendingUp } from "lucide-react"
import { calculateCustomerSegmentation } from "../actions"
import type { SegmentAnalysis } from "@/lib/analytics-types"

export function CustomerSegmentation() {
    const [isPending, startTransition] = useTransition()
    const [analysis, setAnalysis] = useState<SegmentAnalysis | null>(null)
    const [minSpent, setMinSpent] = useState("")
    const [minFrequency, setMinFrequency] = useState("")

    const handleAnalyze = () => {
        startTransition(async () => {
            const result = await calculateCustomerSegmentation({
                minSpent: minSpent ? Number(minSpent) : undefined,
                minFrequency: minFrequency ? Number(minFrequency) : undefined,
            })
            setAnalysis(result)
        })
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Segmentación Avanzada de Clientes</CardTitle>
                    <CardDescription>Análisis de clustering con múltiples criterios</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="minSpent">Gasto Mínimo ($)</Label>
                            <Input
                                id="minSpent"
                                type="number"
                                placeholder="Ej: 10000"
                                value={minSpent}
                                onChange={(e) => setMinSpent(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="minFrequency">Frecuencia Mínima</Label>
                            <Input
                                id="minFrequency"
                                type="number"
                                placeholder="Ej: 5"
                                value={minFrequency}
                                onChange={(e) => setMinFrequency(e.target.value)}
                            />
                        </div>
                    </div>
                    <Button onClick={handleAnalyze} disabled={isPending} className="w-full">
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analizando...
                            </>
                        ) : (
                            "Ejecutar Análisis"
                        )}
                    </Button>
                </CardContent>
            </Card>

            {analysis && (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {analysis.segments.map((segment) => (
                            <Card key={segment.name}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium">{segment.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">Clientes</span>
                                        </div>
                                        <p className="text-2xl font-bold">{segment.count}</p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">Valor Total</span>
                                        </div>
                                        <p className="text-lg font-semibold">${(segment.totalValue / 1000000).toFixed(1)}M</p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">Promedio</span>
                                        </div>
                                        <p className="text-lg font-semibold">${(segment.averageValue / 1000).toFixed(0)}K</p>
                                    </div>

                                    <div className="space-y-1 pt-2">
                                        <p className="text-xs font-medium text-muted-foreground">Características:</p>
                                        {segment.characteristics.map((char, idx) => (
                                            <p key={idx} className="text-xs text-muted-foreground">
                                                • {char}
                                            </p>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recomendaciones</CardTitle>
                            <CardDescription>Acciones sugeridas basadas en el análisis</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {analysis.recommendations.map((rec, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                            {idx + 1}
                                        </span>
                                        <span className="text-sm">{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}
