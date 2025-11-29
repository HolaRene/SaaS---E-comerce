/**
 * PANELES REDIMENSIONABLES
 * Layout de dos paneles con divisor arrastrable
 */

"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ResizablePanelsProps {
    leftPanel: React.ReactNode
    rightPanel: React.ReactNode
    defaultLeftWidth?: number // Porcentaje
    minLeftWidth?: number // Porcentaje mínimo
    maxLeftWidth?: number // Porcentaje máximo
}

export function ResizablePanels({
    leftPanel,
    rightPanel,
    defaultLeftWidth = 40,
    minLeftWidth = 25,
    maxLeftWidth = 60,
}: ResizablePanelsProps) {
    const [leftWidth, setLeftWidth] = useState(defaultLeftWidth)
    const [isDragging, setIsDragging] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Manejar el arrastre del divisor
    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging || !containerRef.current) return

            const containerRect = containerRef.current.getBoundingClientRect()
            const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

            // Aplicar límites
            const clampedWidth = Math.min(Math.max(newLeftWidth, minLeftWidth), maxLeftWidth)

            setLeftWidth(clampedWidth)
        },
        [isDragging, minLeftWidth, maxLeftWidth],
    )

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    // Event listeners globales durante el arrastre
    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
            document.body.style.cursor = "col-resize"
            document.body.style.userSelect = "none"
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
            document.body.style.cursor = ""
            document.body.style.userSelect = ""
        }
    }, [isDragging, handleMouseMove, handleMouseUp])

    return (
        <div ref={containerRef} className="flex h-full w-full">
            {/* Panel izquierdo - Sin overflow-hidden para permitir interacción del mapa */}
            <div className="h-full" style={{ width: `${leftWidth}%` }}>
                {leftPanel}
            </div>

            {/* Divisor redimensionable */}
            <div
                className={cn(
                    "w-1 bg-border hover:bg-primary/50 cursor-col-resize transition-colors relative group z-10",
                    isDragging && "bg-primary",
                )}
                onMouseDown={() => setIsDragging(true)}
            >
                {/* Indicador visual */}
                <div
                    className={cn(
                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                        "w-1 h-8 rounded-full bg-muted-foreground/30",
                        "opacity-0 group-hover:opacity-100 transition-opacity",
                        isDragging && "opacity-100 bg-primary",
                    )}
                />
            </div>

            {/* Panel derecho - Con overflow-hidden para scroll de lista */}
            <div className="h-full overflow-hidden flex-1" style={{ width: `${100 - leftWidth}%` }}>
                {rightPanel}
            </div>
        </div>
    )
}
