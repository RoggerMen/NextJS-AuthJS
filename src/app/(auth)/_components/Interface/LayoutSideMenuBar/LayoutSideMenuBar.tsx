"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Home,
  User,
  FileText,
  Settings,
  LogOut,
  Menu,
  Sun,
  Moon,
  HelpCircle,
  Bell,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

const LayoutSideMenuBar = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" }).then(() => {
      localStorage.removeItem("welcomeModalShown");
    });
  };

  const NavLinks = () => (
    <>
      <Link href="/" className="flex items-center py-3 px-6 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200">
        <Home className="mr-3 md:mr-4 w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8" />
        <span className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl">Inicio</span>
      </Link>
      <Link href="/profile" className="flex items-center py-3 px-6 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200">
        <User className="mr-3 md:mr-4 w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8" />
        <span className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl ">Perfil</span>
      </Link>
      <Link href="/CV" className="flex items-center py-3 px-6 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200">
        <FileText className="mr-3 md:mr-4 w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8" />
        <span className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl">CV/Resumen</span>
      </Link>
      <Link href="/update-info" className="flex items-center py-3 px-6 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200">
        <Settings className="mr-3 md:mr-4 w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8" />
        <span className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl">Configuración</span>
      </Link>
    </>
  );

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 ">
        <DotLottieReact
          src="https://lottie.host/09760e0b-1fd7-4582-a79d-e823630bbc7d/NzudWvuJzL.lottie"
          speed={2}
          loop
          autoplay
        />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Side Menu (hidden on mobile) */}
      <div className="hidden md:flex md:flex-col md:w-80 lg:w-96 xl:w-96 2xl:w-[28rem] 3xl:w-[35rem] bg-blue-600 dark:bg-blue-800 text-white transition-all duration-300">
        <div className="flex items-center justify-center h-20 md:h-24 lg:h-28 xl:h-32 2xl:h-36 3xl:h-40 bg-blue-700 dark:bg-blue-900">
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl font-bold text-center">Mi Plataforma</h1>
        </div>
        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav className="flex-1 px-2 space-y-2">
            <NavLinks />
          </nav>
          <div className="px-4 py-6">
            <div className="flex items-center mb-6">
              <Avatar className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 xl:h-16 xl:w-16 2xl:h-20 2xl:w-20 3xl:h-24 3xl:w-24">
                <AvatarImage
                  src={session?.user?.image || ""}
                  alt={session?.user?.name || ""}
                />
                <AvatarFallback className="bg-lime-400 text-white">
                  {session?.user?.name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl font-medium">
                  {session?.user?.name}
                </p>
                <p className="text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl text-blue-200">
                  {session?.user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Top Navbar */}
        <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-3 md:px-6 lg:px-8 xl:px-12 2xl:px-16 3xl:px-20 max-w-[120rem] mx-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="default" size="icon" className="md:hidden bg-indigo-950">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full bg-blue-600 dark:bg-blue-800 text-white">
                  <div className="flex items-center justify-center h-20 bg-blue-700 dark:bg-blue-900">
                    <h1 className="text-2xl font-bold">Mi Plataforma</h1>
                  </div>
                  <nav className="flex-1 px-2 py-4 space-y-2">
                    <NavLinks />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <nav className="hidden md:flex space-x-4 lg:space-x-6 xl:space-x-8 2xl:space-x-10 3xl:space-x-12 flex-grow justify-center">
              <Link href="/overview" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl font-medium py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">Vista General</Link>
              <Link href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl font-medium py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">Perfil</Link>
              <Link href="/CV" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl font-medium py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">CV/Resumen</Link>
              <Link href="/update-info" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl font-medium py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">Actualizar Información</Link>
            </nav>
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center cursor-pointer">
                    <span className="text-gray-800 dark:text-gray-200 mr-2 text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl">{session?.user?.name}</span>
                    <Avatar className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14 2xl:h-16 2xl:w-16 3xl:h-20 3xl:w-20">
                      <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                      <AvatarFallback className="bg-lime-400 text-white">{session?.user?.name?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notificaciones</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Ayuda</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        {theme === 'light' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                        <span>Modo Oscuro</span>
                      </div>
                      <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-blue-600 dark:bg-gray-900 p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 3xl:p-20">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutSideMenuBar;