"use client"

import Link from "next/link"
import { ChevronRight } from 'lucide-react'
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()


  if (session) {
    return (
      <main>
        <div className="w-full flex flex-col gap-5 items-center justify-center mt-8">
          <p className="">
            Hola, <strong>{session.user?.name}</strong>
          </p>
          <Button
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Cerrar Sesión
          </Button>
          <Link
            href={`/protected`}
            className="h-10 rounded-md border border-zinc-950 text-zinc-950 flex gap-1 items-center justify-center px-6 text-sm"
          >
            <span>Ir a ruta protegida</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    )
  } else {
    return (
      <main>
        <div className="w-full flex flex-col items-center justify-center gap-4 mt-8">
          <Link
            className="h-10 rounded-md bg-zinc-950 text-zinc-100 flex items-center justify-center px-6 text-sm"
            href={`/login`}
          >
            Inicia Sesión
          </Link>
          <Link
            className="h-10 rounded-md border border-zinc-950 text-zinc-950 flex items-center justify-center px-6 text-sm"
            href={`/register`}
          >
            Registrate
          </Link>
        </div>
      </main>
    )
  }
}

