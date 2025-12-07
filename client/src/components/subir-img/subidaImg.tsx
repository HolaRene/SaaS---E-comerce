import Image from "next/image"
import { Input } from "../ui/input"
import { Loader, X, UploadCloud } from "lucide-react"
import { useRef, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useUploadFiles } from "@xixixao/uploadstuff/react"
import { SubidaImgProps } from "@/types/tipos_img"
import { toast } from "sonner"
import { Id } from "../../../convex/_generated/dataModel"

const SubidaImgs = ({ image, setImage, setImageStorageId }: SubidaImgProps) => {
    const [isImageLoading, setIsImageLoading] = useState(false)

    const imageRef = useRef<HTMLInputElement | null>(null);

    // mutación para generar la URL de subida
    const generarSubidaUrl = useMutation(api.archivos.generateUploadUrl)

    // comenzar a subir el audio generado
    const { startUpload } = useUploadFiles(generarSubidaUrl)

    // función de manejo
    const manejoImage = async (blob: Blob, fileName: string) => {
        setIsImageLoading(true)
        setImage('')
        try {
            const file = new File([blob], fileName, { type: 'image/png' });
            // iniciar la subida del archivo
            const uploadResults = await startUpload([file]);
            const storageId = (uploadResults[0].response as any).storageId;

            setImageStorageId(storageId);

            // obtener la URL del archivo subido
            const imgUrl = await getImageURL({ storageId });
            setImage(imgUrl!)
            setIsImageLoading(false)
            toast('Se ha generado el img de miniatura')
        } catch (error) {
            toast('Error en el manejo del img')
            setIsImageLoading(false)
            console.log(error)
        }
    }

    // función para subir img
    const subirImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()

        try {
            const files = e.target.files
            if (!files) return
            const file = files[0];
            const blob = await file.arrayBuffer()
                .then((ab) => new Blob([ab]))
            await manejoImage(blob, file.name)
        } catch (error) {
            console.log(error)
            toast('Error al subir la img a convex')
        }
    }

    // función para obtener la URL del audio subido
    const getImageURL = useMutation(api.archivos.getURL)


    return (
        <div className="w-full">
            <div className="flex items-center justify-center mt-5 h-[142px] w-full cursor-pointer flex-col gap-3 rounded-xl border-[3.2px] border-dashed border-black-6 bg-black-1 hover:bg-gray-50 transition-colors" onClick={() => imageRef?.current?.click()} >
                <Input
                    type="file"
                    className="hidden"
                    ref={imageRef}
                    onChange={(e) => subirImg(e)}
                    accept="image/*"
                />
                {
                    !isImageLoading ? (
                        <>
                            <UploadCloud size={40} className="text-gray-400" />
                        </>
                    ) : (
                        <div className="text-[16px] flex items-center justify-center font-medium text-black">
                            Subiendo...
                            <Loader size={20} className="animate-spin ml-2" />
                        </div>
                    )
                }
                <div className="flex flex-col items-center gap-1">
                    <h2 className="text-[12px] font-bold text-orange-600">
                        Click para subir imagen
                    </h2>
                    <p className="text-[12px] font-normal text-gray-500">Máximo 1 imagen (JPG, PNG, GIF)</p>
                </div>
            </div>

            {
                image && (
                    <div className="flex-center w-full">
                        <Image src={image} alt="imgTHum" width={200} height={200} className="mt-5" />
                    </div>
                )
            }
        </div>
    )
}

export default SubidaImgs
