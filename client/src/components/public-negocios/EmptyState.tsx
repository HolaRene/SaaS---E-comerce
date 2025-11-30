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
    buttonLink = 'descubre',
    buttonText, search }: EmptyStateProps) => {
    return (
        <div className='flex-center size-full flex-col gap-3'>
            <Image src={'/icons/emptyState.svg'} alt="vacío" width={250} height={250} />
            <div className="flex-center w-full max-w-[254px] flex-col gap-3">
                <h1 className="text-white-1 text-16 text-center font-medium">{title}</h1>
                {
                    search && (
                        <p className="text-16 text-center font-medium text-white-2">Intenta ajustar la bsqueda para encontrar tu podcast.</p>
                    )}
                {
                    buttonLink && (
                        <Button className="bg-orange-1 ">
                            <Link href={buttonLink} className="flex gap-2">
                                <Image src={"/icons/discover.svg"} width={20} height={20} alt="descubre" />
                                <h1 className="text-16 font-extrabold text-white-1">{buttonText || 'descubre'} </h1>
                            </Link>
                        </Button>
                    )
                }
            </div>
        </div>
    )
}

export default EmptyState