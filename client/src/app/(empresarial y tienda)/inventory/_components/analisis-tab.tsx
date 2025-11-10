"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { calculateRedistribution, executeAutoRedistribution } from "../actions"
import type { OptimizationStrategy, RedistributionSuggestion } from "@/lib/inventory-types"
import { mockInventoryProducts } from "@/lib/data-inventory"
import { ArrowRight, TrendingUp, DollarSign, Zap } from "lucide-react"
import { toast } from "sonner"


export function AnalysisTab() {
    const [selectedProducts, setSelectedProducts] = useState<string[]>([])
    const [strategy, setStrategy] = useState<OptimizationStrategy>({
        type: "balance",
        priority: "balanced",
    })
    const [suggestions, setSuggestions] = useState<RedistributionSuggestion[]>([])
    const [isPending, startTransition] = useTransition()
    const [isExecuting, startExecuting] = useTransition()

    // Filter products that need optimization
    const productsNeedingOptimization = mockInventoryProducts.filter(
        (p) => p.status === "low" || p.status === "critical" || p.status === "overstock",
    )

    const handleCalculate = () => {
        if (selectedProducts.length === 0) {
            toast("Debes seleccionar al menos un producto para analizar")
            return
        }

        startTransition(async () => {
            const results = await calculateRedistribution(selectedProducts, strategy)
            setSuggestions(results)
            toast(`Se generaron ${results.length} sugerencias de redistribución`)
        })
    }

    const handleExecute = () => {
        if (suggestions.length === 0) return

        startExecuting(async () => {
            const suggestionIds = suggestions.map((s) => s.id)
            const result = await executeAutoRedistribution(suggestionIds)

            if (result.success) {
                toast(result.message)
                setSuggestions([])
                setSelectedProducts([])
            }
        })
    }

    const toggleProduct = (productId: string) => {
        setSelectedProducts((prev) =>
            prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
        )
    }

    const totalImpact = suggestions.reduce((sum, s) => sum + s.estimatedImpact.costSavings, 0)
    const avgTurnoverImprovement =
        suggestions.length > 0
            ? suggestions.reduce((sum, s) => sum + s.estimatedImpact.turnoverImprovement, 0) / suggestions.length
            : 0

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Seleccionar Productos</CardTitle>
                        <CardDescription>Elige los productos que necesitan optimización</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {productsNeedingOptimization.map((product) => (
                            <div key={product.id} className="flex items-center space-x-3 rounded-lg border p-3">
                                <Checkbox
                                    id={product.id}
                                    checked={selectedProducts.includes(product.id)}
                                    onCheckedChange={() => toggleProduct(product.id)}
                                />
                                <Label htmlFor={product.id} className="flex-1 cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {product.totalStock} unidades • {product.category}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={
                                                product.status === "critical"
                                                    ? "destructive"
                                                    : product.status === "low"
                                                        ? "destructive"
                                                        : "default"
                                            }
                                        >
                                            {product.status}
                                        </Badge>
                                    </div>
                                </Label>
                            </div>
                        ))}
                        {productsNeedingOptimization.length === 0 && (
                            <p className="text-center text-sm text-muted-foreground py-4">
                                No hay productos que requieran optimización
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Estrategia de Optimización</CardTitle>
                        <CardDescription>Configura cómo se debe optimizar la distribución</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label>Tipo de Optimización</Label>
                            <RadioGroup
                                value={strategy.type}
                                onValueChange={(value) => setStrategy({ ...strategy, type: value as any })}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="balance" id="balance" />
                                    <Label htmlFor="balance" className="cursor-pointer">
                                        Balancear stock entre tiendas
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="minimize_transfers" id="minimize" />
                                    <Label htmlFor="minimize" className="cursor-pointer">
                                        Minimizar número de transferencias
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="maximize_turnover" id="maximize" />
                                    <Label htmlFor="maximize" className="cursor-pointer">
                                        Maximizar rotación de inventario
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-3">
                            <Label>Prioridad</Label>
                            <RadioGroup
                                value={strategy.priority}
                                onValueChange={(value) => setStrategy({ ...strategy, priority: value as any })}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="cost" id="cost" />
                                    <Label htmlFor="cost" className="cursor-pointer">
                                        Minimizar costos
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="speed" id="speed" />
                                    <Label htmlFor="speed" className="cursor-pointer">
                                        Maximizar velocidad
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="balanced" id="balanced" />
                                    <Label htmlFor="balanced" className="cursor-pointer">
                                        Balanceado
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <Button onClick={handleCalculate} disabled={isPending || selectedProducts.length === 0} className="w-full">
                            {isPending ? "Calculando..." : "Calcular Redistribución"}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {suggestions.length > 0 && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Sugerencias de Redistribución</CardTitle>
                                <CardDescription>{suggestions.length} transferencias recomendadas</CardDescription>
                            </div>
                            <Button onClick={handleExecute} disabled={isExecuting}>
                                <Zap className="mr-2 h-4 w-4" />
                                {isExecuting ? "Ejecutando..." : "Ejecutar Todo"}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-2xl font-bold">${totalImpact}</p>
                                            <p className="text-xs text-muted-foreground">Ahorro estimado</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-2xl font-bold">+{avgTurnoverImprovement.toFixed(1)}x</p>
                                            <p className="text-xs text-muted-foreground">Mejora rotación</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2">
                                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-2xl font-bold">{suggestions.length}</p>
                                            <p className="text-xs text-muted-foreground">Transferencias</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-3">
                            {suggestions.map((suggestion) => (
                                <div key={suggestion.id} className="rounded-lg border p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={
                                                        suggestion.priority === "high"
                                                            ? "destructive"
                                                            : suggestion.priority === "medium"
                                                                ? "default"
                                                                : "secondary"
                                                    }
                                                >
                                                    {suggestion.priority === "high"
                                                        ? "Alta"
                                                        : suggestion.priority === "medium"
                                                            ? "Media"
                                                            : "Baja"}
                                                </Badge>
                                                <span className="font-medium">{suggestion.productName}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-muted-foreground">{suggestion.fromStore}</span>
                                                <ArrowRight className="h-4 w-4" />
                                                <span className="text-muted-foreground">{suggestion.toStore}</span>
                                                <Badge variant="outline">{suggestion.quantity} unidades</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                                            <div className="flex gap-4 text-xs">
                                                <span className="text-green-600">💰 Ahorro: ${suggestion.estimatedImpact.costSavings}</span>
                                                <span className="text-blue-600">
                                                    📈 Rotación: +{suggestion.estimatedImpact.turnoverImprovement}x
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
