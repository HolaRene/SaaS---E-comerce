import { Loader } from "lucide-react"

const SpinnerLoader = () => {
    return (
        <div className='flex justify-center items-center h-screen w-full'>
            <Loader className="animate-spin text-orange-1" size={30} />
        </div>
    )
}

export default SpinnerLoader