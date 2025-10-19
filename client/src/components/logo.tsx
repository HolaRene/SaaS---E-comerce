import React from 'react';
import { Store, ShoppingCart } from 'lucide-react';

interface LogoProps {
    width?: number;
    height?: number;
    className?: string;
    showIcon?: boolean;
    variant?: 'default' | 'bold' | 'minimal';
}

export const Logo: React.FC<LogoProps> = ({
    width = 180,
    height = 40,
    className = "",
    showIcon = true,
    variant = 'default'
}) => {
    return (
        <div className={`flex items-center gap-3 ${className}`} style={{ width, height }}>
            {/* Icono */}
            {showIcon && (
                <div className="flex items-center justify-center">
                    <div className="relative">
                        {/* Fondo circular */}
                        <div className="absolute inset-0 bg-amber-300 rounded-full transform scale-110"></div>

                        {/* Icono principal */}
                        <div className="relative bg-gradient-to-br from-orange-400 to-red-500 rounded-lg p-1.5 shadow-lg">
                            <Store
                                size={variant === 'minimal' ? 20 : 24}
                                className="text-white"
                                strokeWidth={2.5}
                            />
                        </div>

                        {/* Icono pequeño flotante */}
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-md border">
                            <ShoppingCart
                                size={12}
                                className="text-blue-500"
                                strokeWidth={2.5}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Texto */}
            <div className="flex flex-col">
                <span className={`
                    font-bold leading-tight
                    ${variant === 'bold'
                        ? 'text-2xl tracking-tight text-gray-900'
                        : variant === 'minimal'
                            ? 'text-lg tracking-normal text-gray-800'
                            : 'text-xl tracking-tight text-gray-900'
                    }
                `}>
                    MiTienda
                </span>
                <span className={`
                    font-semibold leading-tight bg-gradient-to-r from-blue-800 to-blue-900 bg-clip-text text-transparent
                    ${variant === 'bold'
                        ? 'text-lg tracking-tight'
                        : variant === 'minimal'
                            ? 'text-sm tracking-normal'
                            : 'text-md tracking-tight'
                    }
                `}>
                    Digital
                </span>
            </div>
        </div>
    );
};

// Versión alternativa solo SVG (para casos donde necesites SVG puro)
export const LogoSVG: React.FC<LogoProps> = ({
    width = 180,
    height = 40,
    className = "",
    showIcon = true
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 180 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Icono */}
            {showIcon && (
                <g transform="translate(0, 5)">
                    {/* Fondo circular */}
                    <circle cx="20" cy="15" r="18" fill="#FFEDD5" />

                    {/* Icono de tienda */}
                    <path
                        d="M15 10H25V20H15V10Z"
                        fill="url(#storeGradient)"
                        stroke="white"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M12 20H28V25H12V20Z"
                        fill="url(#storeGradient)"
                        stroke="white"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M14 25V28H26V25"
                        stroke="white"
                        strokeWidth="1.5"
                        fill="none"
                    />

                    {/* Icono de carrito pequeño */}
                    <circle cx="28" cy="8" r="6" fill="white" stroke="#EA580C" strokeWidth="1" />
                    <path
                        d="M26 7L30 7"
                        stroke="#EA580C"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    <circle cx="26" cy="6" r="0.75" fill="#EA580C" />
                    <circle cx="30" cy="6" r="0.75" fill="#EA580C" />
                </g>
            )}

            {/* Texto MiPulperia */}
            <text
                x={showIcon ? "45" : "0"}
                y="20"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight="bold"
                fontSize="16"
                fill="#1F2937"
                letterSpacing="-0.5"
            >
                MiTienda
            </text>

            {/* Texto Digital */}
            <text
                x={showIcon ? "45" : "0"}
                y="35"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight="600"
                fontSize="14"
                fill="url(#textGradient)"
                letterSpacing="-0.25"
            >
                Digital
            </text>

            <defs>
                <linearGradient id="storeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#DC2626" />
                </linearGradient>
                <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#EA580C" />
                    <stop offset="100%" stopColor="#DC2626" />
                </linearGradient>
            </defs>
        </svg>
    );
};