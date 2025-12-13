import Image from "next/image"
import { Input } from "../ui/input"
import { Loader, X, UploadCloud } from "lucide-react"
import { useRef, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useUploadFiles } from "@xixixao/uploadstuff/react"
import { SubidaMultiplesImgsProps } from "@/types/tipos_img"
import { toast } from "sonner"
import { Id } from "../../../convex/_generated/dataModel"

const SubidaImgs = ({ imageUrls, setImageUrls, imageStorageIds, setImageStorageIds }: SubidaMultiplesImgsProps) => {
    const [isImageLoading, setIsImageLoading] = useState(false)

    const imageRef = useRef<HTMLInputElement | null>(null);

    const getImageURL = useMutation(api.archivos.getURL)
    // mutación para generar la URL de subida
    const generarSubidaUrl = useMutation(api.archivos.generateUploadUrl)

    // comenzar a subir el audio generado
    const { startUpload } = useUploadFiles(generarSubidaUrl)

    // función de manejo
    const manejoImages = async (files: File[]) => {
        setIsImageLoading(true)
        try {
            // iniciar la subida de archivos
            const uploadResults = await startUpload(files);

            const newUrls: string[] = []
            const newStorageIds: Id<"_storage">[] = []

            await Promise.all(uploadResults.map(async (result) => {
                const storageId = (result.response as any).storageId as Id<"_storage">;
                newStorageIds.push(storageId);
                const url = await getImageURL({ storageId });
                if (url) newUrls.push(url);
            }));

            setImageStorageIds(prev => [...prev, ...newStorageIds]);
            setImageUrls(prev => [...prev, ...newUrls]);

            setIsImageLoading(false)
            toast.success('Imágenes subidas correctamente')
        } catch (error) {
            toast.error('Error al subir las imágenes')
            setIsImageLoading(false)
            console.log(error)
        }
    }

    // función para subir img
    const subirImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()

        try {
            const files = e.target.files
            if (!files || files.length === 0) return

            const filesArray = Array.from(files);

            if (imageUrls.length + filesArray.length > 3) {
                toast.error("Solo puedes subir un máximo de 5 imágenes.");
                return;
            }

            await manejoImages(filesArray)
        } catch (error) {
            console.log(error)
            toast('Error al procesar las imágenes')
        }
    }

    const removeImage = (index: number) => {
        const newUrls = [...imageUrls];
        const newStorageIds = [...imageStorageIds];

        newUrls.splice(index, 1);
        newStorageIds.splice(index, 1);

        setImageUrls(newUrls);
        setImageStorageIds(newStorageIds);
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-center mt-5 h-[142px] w-full cursor-pointer flex-col gap-3 rounded-xl border-[3.2px] border-dashed border-black-6 bg-black-1 hover:bg-gray-50 transition-colors" onClick={() => imageRef?.current?.click()} >
                <Input
                    type="file"
                    className="hidden"
                    ref={imageRef}
                    onChange={(e) => subirImg(e)}
                    multiple
                    accept="image/*"
                />
                {
                    !isImageLoading ? (
                        <>
                            <UploadCloud size={40} className="text-green-400" />
                        </>
                    ) : (
                        <div className="text-[16px] flex items-center justify-center font-medium text-red">
                            Subiendo...
                            <Loader size={20} className="animate-spin ml-2" />
                        </div>
                    )
                }
                <div className="flex flex-col items-center gap-1">
                    <h2 className="text-[12px] font-bold text-blue-600">
                        Click para subir imágenes
                    </h2>
                    <p className="text-[12px] font-normal text-gray-500">Máximo 5 imágenes (JPG, PNG, GIF)</p>
                </div>
            </div>

            {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
                    {imageUrls.map((url, index) => (
                        <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                            <Image
                                src={url}
                                alt={`Producto imagen ${index + 1}`}
                                className="object-cover w-full h-full"
                                width={200}
                                height={200}
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SubidaImgs
