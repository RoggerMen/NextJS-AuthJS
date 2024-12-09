"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import GoogleSignInButton from "./(auth)/_components/AuthForm/GoogleSignInButton";
import { useEffect, useState } from "react";
import Modal from "./(auth)/_components/Interface/UI/modal";

export default function Home() {
  const { data: session } = useSession();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Verificar si ya se mostró el modal en el almacenamiento local
    if (session && !localStorage.getItem("welcomeModalShown")) {
      setShowModal(true);
      localStorage.setItem("welcomeModalShown", "true"); // Marcar el modal como mostrado
    }
  }, [session]);

  if (session) {
    return (
      <main>
        <div className="w-full flex flex-col items-center justify-center gap-5 mt-8">
          <p className="">
            Hola, <strong>{session.user?.name}</strong>
          </p>
          <Button onClick={() => signOut({ callbackUrl: "/" }).then(()=> localStorage.removeItem("welcomeModalShown"))}>
            Cerrar Sesión
          </Button>
          <Link
            href={`/protected`}
            className="h-10 rounded-md border border-gray-400 text-zinc-950 flex items-center justify-center  gap-1 px-6 text-sm hover:bg-zinc-200 transition-colors"
          >
            <span>Ir a ruta protegida</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          {/* Modal de bienvenida */}
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">
                ¡Bienvenido, {session?.user?.name}!
              </h2>
              <p className="text-gray-700 mb-4">
                Inicio de sesión exitoso. Estamos emocionados de tenerte de
                vuelta.
              </p>
              <Button
                onClick={() => setShowModal(false)}
                className="bg-lime-400 hover:bg-lime-500 text-white transition-colors duration-200"
              >
                Comenzar
              </Button>
            </div>
          </Modal>
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
