
import Image from "next/image"
import { useRouter } from "next/navigation"

interface TiendaCardProps {
    description: string
    imgUrl: string
    title: string
    tiendaId: string
}
const TiendaCard = ({ description, imgUrl, title, tiendaId }: TiendaCardProps) => {
    const ruta = useRouter()
    // obtener el podcast 

    // función para manejar las vistas del podcast
    const manejoVistas = () => {
        ruta.push(`/tienda/${tiendaId}`, { scroll: true })
    }
    return (
        <div className='cursor-pointer' onClick={manejoVistas}>
            <figure className="flex flex-col gap-2">
                <Image src={imgUrl} alt={title} width={34} height={34} className="aspect-square h-fit  w-full rounded-xl 2xl:size-[50px]" />
                <div className="flex flex-col">
                    <h1 className="text-[16px] font-bold  trunkate">{title}</h1>
                    <h2 className="text-[12px] font-normal capitalize trunkate">{description}</h2>
                </div>
            </figure>
        </div>
    )
}

export default TiendaCard