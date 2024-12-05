"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import GoogleSignInButton from "./(auth)/_components/AuthForm/GoogleSignInButton";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  
  if (session) {
    return (
      <main>
        <div className="w-full flex flex-col items-center justify-center gap-5 mt-8">
          <p className="">
            Hola, <strong>{session.user?.name}</strong>
          </p>
          <img src={`${session.user?.image}`} />
          <Button onClick={() => signOut({ callbackUrl: "/" })}>
            Cerrar Sesión
          </Button>
          <Link
            href={`/protected`}
            className="h-10 rounded-md border border-gray-400 text-zinc-950 flex items-center justify-center  gap-1 px-6 text-sm hover:bg-zinc-200 transition-colors"
          >
            <span>Ir a ruta protegida</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  } else {
    return (
      <main>
        <div className="w-full flex flex-col items-center justify-center gap-4 mt-8">
          <h1 className="text-3xl font-bold text-center">Bienvenido a NextAuth.js</h1>
          {!isLoadingGoogle && (
          <Link
            className="h-10 rounded-md bg-zinc-950  text-zinc-100 flex items-center justify-center px-6 text-sm hover:bg-zinc-800 transition-colors"
            href={`/login`}
          >
            Inicia Sesión
          </Link>
          )}
          {!isLoadingGoogle && (
          <Link
            className="h-10 rounded-md border border-gray-300 text-zinc-950 flex items-center justify-center px-6 text-sm hover:bg-gray-200 transition-colors"
            href={`/register`}
          >
            Regístrate
          </Link>
          )}
        {!isLoadingGoogle && (
          <div className="flex items-center w-4/5 gap-2">
            <div className="border-t border-zinc-300 flex-grow"></div>
            <span className="text-sm text-zinc-500">O</span>
            <div className="border-t border-zinc-300 flex-grow"></div>
          </div>
        )}
          <GoogleSignInButton isLoading={isLoadingGoogle}
            setIsLoading={setIsLoadingGoogle}>
            Inicia Sesión con Google
          </GoogleSignInButton>
        </div>
      </main>
      
    );
  }
}
