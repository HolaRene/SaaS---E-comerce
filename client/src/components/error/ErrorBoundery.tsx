"use client";

import React from "react";
import { ConvexError } from "convex/values";

export class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: unknown }
> {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error: unknown) {
        return { hasError: true, error };
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        const error = this.state.error;

        if (error instanceof ConvexError) {
            const data = error.data as { message?: string };
            return (
                <div className="p-4 text-center">
                    <p className="font-bold text-red-600 text-xl">
                        ⚠ {data?.message ?? "Error de aplicación"}
                    </p>
                </div>
            );
        }

        return (
            <div className="p-4 text-center text-red-600 font-bold text-xl">
                Error inesperado, puede ser id no funcional
            </div>
        );
    }
}
