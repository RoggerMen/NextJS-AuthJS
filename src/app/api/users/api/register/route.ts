import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";

export const POST = async (req: NextRequest) => {
  const { username, email, password } = await req.json();

  try {
    const usernameExists = await prisma.user.findUnique({ where: { username } });
    const emailExists = await prisma.user.findUnique({ where: { email } });

    if (usernameExists) {
      return NextResponse.json({ error: "El usuario ya existe" });
    } else if (emailExists) {
      return NextResponse.json({ error: "El correo ya existe" });
    }

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password,
        profile: {
          create: {},
        },
      },
      include: {
        profile: true,
      },
    });

    // Enviar correo de bienvenida
    await sendWelcomeEmail(email, username);

    return NextResponse.json({ ok: true, message: "Usuario registrado exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno del Servidor" }, { status: 500 });
  }
};

