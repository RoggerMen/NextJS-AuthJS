import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function OverviewPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">Descripción general
        </h1>
        <p>Complete su perfil para ver una descripción general.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Descripción general</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Carrera</CardTitle>
          </CardHeader>
          <CardContent>{profile.career}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Educación</CardTitle>
          </CardHeader>
          <CardContent>{profile.education}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Nivel de inglés</CardTitle>
          </CardHeader>
          <CardContent>{profile.englishLevel}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Salario deseado</CardTitle>
          </CardHeader>
          <CardContent>${profile.salary}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Años de experiencia</CardTitle>
          </CardHeader>
          <CardContent>{profile.experience}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>LinkedIn</CardTitle>
          </CardHeader>
          <CardContent>
            <a href={
        profile.linkedin?.startsWith("http")
          ? profile.linkedin
          : `https://${profile.linkedin}`
      } target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {profile.linkedin}
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

