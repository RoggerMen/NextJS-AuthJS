import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const data = await req.json()
  const { email, phoneNumber, currentPassword, newPassword } = data

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    let updateData: any = {}

    if (email && email !== user.email) {
      updateData.email = email
    }

    if (phoneNumber) {
      updateData.phoneNumber = phoneNumber
    }

    if (currentPassword && newPassword) {
        if (currentPassword !== user.password) {
          return NextResponse.json({ error: "La contraseña actual es incorrecta" }, { status: 400 });
        }
        updateData.password = newPassword;
      }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    })

    return NextResponse.json({ message: "La configuración del Usuario se actualizó correctamente" })
  } catch (error) {
    console.error("No se pudo actualizar la configuración del Usuario:", error)
    return NextResponse.json({ error: "No se pudo actualizar la configuración del Usuario" }, { status: 500 })
  }
}

