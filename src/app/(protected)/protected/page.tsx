import { ChevronLeft } from 'lucide-react'
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <main className="w-full flex items-center gap-4 text-2xl font-semibold text-zinc-200 text-center flex-col mt-8">
      <p>Ruta Protegida - Bienvenido, {session.user?.name} a Tenmás XYZ</p>
      <Link
        href={"/"}
        className="flex items-center gap-2 bg-zinc-950 hover:bg-gray-900 h-10 rounded-md justify-center text-sm w-fit px-6 text-zinc-100"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Volver al Inicio</span>
      </Link>
    </main>
  )
}