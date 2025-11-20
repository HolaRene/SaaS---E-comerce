import { SignIn } from "@clerk/nextjs"

const SignInPage = () => {
    return (
        <div className='flex justify-center items-center glassmorphism-auth h-screen w-full bg-red-500'>
            <SignIn />
        </div>
    )
}

export default SignInPage