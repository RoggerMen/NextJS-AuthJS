import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const data = await req.json()
  const { phoneNumber, currentPassword, newPassword } = data

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    type UpdateData = {
      phoneNumber?: string;
      password?: string;
    };

    const updateData: UpdateData = {};

    if (phoneNumber) {
      updateData.phoneNumber = phoneNumber
    }

    if (session.provider === 'credentials') {
      if (currentPassword && newPassword) {
        if (currentPassword !== user.password) {
          return NextResponse.json({ error: "La contraseña actual es incorrecta" }, { status: 400 });
        }
        updateData.password = newPassword;
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    })

    return NextResponse.json({ message: "La configuración del Usuario se actualizó correctamente" })
  } catch (error) {
    console.error("No se pudo actualizar la configuración del Usuario:", error)
    return NextResponse.json({ error: "No se pudo actualizar la configuración del Usuario" }, { status: 500 })
  }
}

