import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"

interface EmptyStateProps {
    title: string
    buttonLink?: string
    buttonText?: string
    search?: boolean
}

const EmptyState = ({ title,
    buttonLink = 'comercios',
    buttonText, search }: EmptyStateProps) => {
    return (
        <div className='flex justify-center items-center size-full flex-col gap-3'>
            <Image src={'/icons/vacio.png'} alt="vacío" width={150} height={150} />
            <div className="flex justify-center items-center w-full max-w-[254px] flex-col gap-3">
                <h1 className="text-[16px] text-center font-medium">{title}</h1>
                {
                    search && (
                        <p className="text-[16px] text-center font-medium">Intenta ajustar la busqueda para encontrar tu podcast.</p>
                    )}
                {
                    buttonLink && (
                        <Button className="bg-green-500">
                            <Link href={buttonLink} className="flex gap-2">
                                <Image src={"/icons/buscar-96.png"} width={20} height={20} alt="descubre" />
                                <h1 className="text-[16px] font-extrabold">{buttonText || 'Descubre mas tiendas'} </h1>
                            </Link>
                        </Button>
                    )
                }
            </div>
        </div>
    )
}

export default EmptyState