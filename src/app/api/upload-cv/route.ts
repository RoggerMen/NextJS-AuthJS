import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return NextResponse.json({ error: "Not authenticated or user ID is missing" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");
  const relativePath = `/uploads/${filename}`;
  const fullPath = path.join(process.cwd(), "public", relativePath);

  try {
    await writeFile(fullPath, buffer);

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: { cvUrl: relativePath },
      create: { userId: session.user.id, cvUrl: relativePath },
    });

    return NextResponse.json({ message: "File uploaded successfully", cvUrl: relativePath });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}