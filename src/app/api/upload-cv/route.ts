import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import cloudinary from "@/utils/cloudinary";
import { UploadApiResponse } from "cloudinary";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "No autenticado o falta el correo electrónico del usuario" },
      { status: 401 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { error: "No se ha subido ningún archivo" },
      { status: 400 }
    );
  }

  try {
    // Validar tipo de archivo (si solo deseas PDF, DOCX, etc.)
    if (
      ![
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      return NextResponse.json(
        { error: "Formato no permitido" },
        { status: 400 }
      );
    }

    // Subir archivo a Cloudinary con nombre original
    const uploadResponse = await new Promise<UploadApiResponse | undefined>(
      async (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "cvs",
            resource_type: "auto", // Asegura que detecta el tipo (PDF, DOCX, etc.)
            use_filename: true, // Preserva el nombre original del archivo
            unique_filename: true, // No genera un nombre único
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        const buffer = Buffer.from(await file.arrayBuffer());
        uploadStream.end(buffer); // Usamos `end()` directamente con el buffer
      }
    );

    // Asegúrate de que `uploadResponse` no sea undefined antes de acceder a `secure_url`
    if (!uploadResponse || !uploadResponse.secure_url) {
      return NextResponse.json(
        { error: "Error al subir el archivo a Cloudinary" },
        { status: 500 }
      );
    }
    // Obtener la URL del archivo cargado
    // Ahora accedemos a `secure_url` de forma segura
    const fileUrl = uploadResponse.secure_url;

    // Guardar la URL del archivo en la base de datos
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    if (user.profile) {
      // Si el perfil existe, actualizar la URL del CV
      await prisma.profile.update({
        where: { userId: user.id },
        data: { cvUrl: fileUrl },
      });
    } else {
      // Si no existe el perfil, crearlo
      await prisma.profile.create({
        data: { userId: user.id, cvUrl: fileUrl },
      });
    }

<<<<<<< HEAD
    return NextResponse.json({
      message: "Archivo cargado exitosamente",
      cvUrl: fileUrl,
    });
  } catch (error) {
    console.error("Error al subir archivo:", error);
    return NextResponse.json(
      { error: "Error al subir archivo" },
      { status: 500 }
    );
=======
    return NextResponse.json({ message: "Archivo cargado exitosamente", cvUrl: relativePath });
  } catch (error) {
    console.error("Error al cargar el archivo:", error);
    return NextResponse.json({ error: "Error al cargar el archivo:" }, { status: 500 });
>>>>>>> interface
  }
}
