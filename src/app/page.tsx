"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GoogleSignInButton from "./(auth)/_components/AuthForm/GoogleSignInButton";
import Modal from "./(auth)/_components/Interface/UI/modal";
import { LogOut, Shield } from 'lucide-react';

export default function Home() {
  const { data: session } = useSession();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (session && !localStorage.getItem("welcomeModalShown")) {
      setShowModal(true);
      localStorage.setItem("welcomeModalShown", "true");
    }
  }, [session]);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" }).then(() => {
      localStorage.removeItem("welcomeModalShown");
    });
  };

  if (session) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-blue-600 dark:bg-gray-900">
        <Card className="w-full max-w-md bg-white/10 dark:bg-gray-800/30 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-800 dark:text-white">
              Bienvenido, {session.user?.name}!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-gray-200 dark:text-gray-300">
              Has iniciado sesión correctamente en nuestra plataforma.
            </p>
            <div className="space-y-4">
              <Link href="/protected" passHref>
                <Button className="w-full bg-lime-500 hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-700 text-black dark:text-white">
                  <Shield className="mr-2 h-4 w-4" /> Ir Tenmás XYZ
                </Button>
              </Link>
              <Button
                onClick={handleSignOut}
                className="w-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white"
              >
                <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
              </Button>
            </div>
          </CardContent>
        </Card>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="text-center p-6 bg-white dark:bg-gray-800">
            <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              Bienvenido de nuevo, {session?.user?.name}!
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
              Estamos encantados de tenerte aquí. ¡Busca lo mejor para ti!
            </p>
            <Button
              onClick={() => setShowModal(false)}
              className="bg-lime-500 hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-700 text-white text-lg px-6 py-3 rounded-md transition-all duration-300 transform hover:scale-105"
            >
              Empecemos
            </Button>
          </div>
        </Modal>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-4">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/fondo-2.webp"
          alt="Technology Background"
          layout="fill"
          objectFit="cover"
          className="opacity-60"
        />
      </div>
      <Card className="relative z-10 w-full max-w-md bg-white/10 dark:bg-gray-800/30 backdrop-blur-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center text-white dark:text-gray-100 mb-2">
            Bienvenido a NextAuth.js
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-white dark:text-gray-200 font-semibold text-xl">
            Explora nuestra plataforma que te facilita los medios para ser reclutador o ser reclutado.
          </p>
          <div className="space-y-4">
            <Link href="/login" passHref>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-lg py-6 my-2 rounded-full transition-all duration-300 transform hover:scale-105">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register" passHref>
              <Button className="w-full bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400 text-lg py-6 my-2 rounded-full transition-all duration-300 transform hover:scale-105">
                Registrar
              </Button>
            </Link>
            <div className="relative">
              <div className="flex items-center w-5/5 gap-2">
                <div className="border-t border-zinc-300 dark:border-zinc-600 flex-grow"></div>
                <span className="text-lg text-slate-50 dark:text-gray-300">O continua con</span>
                <div className="border-t border-zinc-300 dark:border-zinc-600 flex-grow"></div>
              </div>
            </div>
            <GoogleSignInButton
              isLoading={isLoadingGoogle}
              setIsLoading={setIsLoadingGoogle}
            >
              Iniciar Sesión con Google
            </GoogleSignInButton>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

