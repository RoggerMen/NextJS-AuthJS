import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(req: NextRequest) {
    const session = await auth()
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }
  
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")
  
    const skip = (page - 1) * pageSize
  
    try {
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where: {
            role: "user", // Filtrar solo usuarios con rol 'user'
          },
          skip,
          take: pageSize,
          include: {
            profile: true,
          },
        }),
        prisma.user.count({
          where: {
            role: "user", // Contar solo usuarios con rol 'user'
          },
        }),
      ])
  
      return NextResponse.json({ users, total })
    } catch (error) {
      console.error("Error fetching users:", error)
      return NextResponse.json({ error: "Error fetching users" }, { status: 500 })
    }
  }