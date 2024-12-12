"use client";

import { signIn } from "next-auth/react";
import { FC, ReactNode } from "react";
import { FcGoogle } from "react-icons/fc"
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface GoogleSignInButtonProps {
  children: ReactNode;
  isLoading?: boolean;
  setIsLoading:(loading: boolean) => void;
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children, isLoading, setIsLoading }) => {
  const router = useRouter();
  

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signIn("google", { callbackUrl: "/" });
      if (result?.error) {
        console.error("Error signing in with Google:", result.error);
        setIsLoading(false);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className={`flex items-center justify-center gap-1.5 ${
        isLoading
          ? "bg-slate-300 cursor-not-allowed w-full"
          : " w-full bg-white hover:bg-slate-100"
      }
              bg-white text-black border border-gray-300 px-4 py-2 mt-4  rounded-full transition-all duration-300 transform hover:scale-105`}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" />
          <span>Inicia Sesión con Google...</span>
        </>
      ) : (
        <>
          <FcGoogle size={30} />
          {children}
        </>
      )}
    </button>
  );
};

export default GoogleSignInButton;
