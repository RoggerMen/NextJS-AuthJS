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

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("No se pudo obtener el perfil:", error)
    return NextResponse.json({ error: "No se pudo obtener el perfil" }, { status: 500 })
  }
}