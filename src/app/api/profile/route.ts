import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const data = await req.json()

  try {
    const updatedProfile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: data,
      create: { ...data, userId: session.user.id },
    })

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error("No se pudo actualizar el perfil:", error)
    return NextResponse.json({ error: "No se pudo actualizar el perfil" }, { status: 500 })
  }
}

