import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function OverviewPage() {
  const session = await auth()
  if (!session?.user?.email) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true },
  })

  if (!user || !user.profile) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Descripción general</h1>
        <p className="mb-4 text-gray-600 dark:text-gray-300">Complete su perfil para ver una descripción general.</p>
        <Link href="/profile">
          <Button>Completar Perfil</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Descripción general</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-white">Nombre</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 dark:text-gray-300 break-words">{user.name || 'No especificado'}</CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-white">Email</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 dark:text-gray-300 break-words">{user.email}</CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-white">Teléfono</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 dark:text-gray-300 break-words">{user.phoneNumber || 'No especificado'}</CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-white">Carrera</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 dark:text-gray-300 break-words">{user.profile.career || 'No especificado'}</CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-white">Educación</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 dark:text-gray-300 break-words">{user.profile.education || 'No especificado'}</CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-white">Nivel de inglés</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 dark:text-gray-300 break-words">{user.profile.englishLevel || 'No especificado'}</CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-white">Salario deseado</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 dark:text-gray-300 break-words">{user.profile.salary ? `$${user.profile.salary}` : 'No especificado'}</CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-white">Años de experiencia</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 dark:text-gray-300 break-words">{user.profile.experience || 'No especificado'}</CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-white">LinkedIn</CardTitle>
          </CardHeader>
          <CardContent className="break-words">
            {user.profile.linkedin ? (
              <a href={user.profile.linkedin.startsWith("http") ? user.profile.linkedin : `https://${user.profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                {user.profile.linkedin}
              </a>
            ) : (
              <span className="text-gray-600 dark:text-gray-300">No especificado</span>
            )}
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-white">CV</CardTitle>
          </CardHeader>
          <CardContent className="break-words">
            {user.profile.cvUrl ? (
              <a href={user.profile.cvUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                Ver CV
              </a>
            ) : (
              <span className="text-gray-600 dark:text-gray-300">No subido</span>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <Link href="/profile">
          <Button  className="w-full  dark:bg-blue-500 dark:hover:bg-blue-600" >Editar Perfil</Button>
        </Link>
      </div>
    </div>
  )
}

