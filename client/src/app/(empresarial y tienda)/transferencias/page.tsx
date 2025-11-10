import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

const Transferencias = () => {
    return (
        <div className='flex flex-col gap-2 items-center justify-center h-screen'>
            <h1 className="text-2xl">Por el momento se está  en esta onda</h1>
            <Button>
                <Eye />
                Ver como se trabaja</Button>
        </div>
    )
}

export default Transferencias