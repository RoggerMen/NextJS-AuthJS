"use client"

import { signIn } from "next-auth/react"
import { FC, ReactNode } from "react"
import { FcGoogle } from "react-icons/fc"
import { useRouter } from "next/navigation"

interface GoogleSignInButtonProps {
    children: ReactNode
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
    const router = useRouter()

    const handleGoogleSignIn = async () => {
        try {
            const result = await signIn("google", { callbackUrl: "/" })
            if (result?.error) {
                console.error("Error signing in with Google:", result.error)
            } else {
                router.push("/")
            }
        } catch (error) {
            console.error("Error signing in with Google:", error)
        }
    }

    return (
        <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 bg-white text-black border border-gray-300 rounded-lg px-4 py-2 mt-4 hover:bg-gray-100 transition-colors"
        >
            <FcGoogle size={24} />
            {children}
        </button>
    )
}

export default GoogleSignInButton