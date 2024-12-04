'use client'
import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

import { FC, ReactNode } from "react";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle } from "../../actionGoogle/signInGoogle";

interface GoogleSignInButtonProps {
    children: ReactNode;
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {


    return (
        <button
      type="button"
      className="w-full my-4 flex items-center justify-center gap-2"
      onClick={signInWithGoogle}
    >
      <FcGoogle size={24} />
      <span>{children}</span>
    </button>
    );

}

export default GoogleSignInButton;