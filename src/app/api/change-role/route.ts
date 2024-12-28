import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { role } = await req.json()

  if (role !== 'postulante' && role !== 'reclutador') {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 })
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email! },
      data: { role },
    })

    return NextResponse.json({ message: "Role updated successfully", role: updatedUser.role })
  } catch (error) {
    console.error("Failed to update user role:", error)
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 })
  }
}

