import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function CandidatesPage() {
  const session = await auth()
  if (!session?.user?.email) {
    redirect('/login')
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!currentUser || currentUser.role !== 'reclutador') {
    redirect('/')
  }

  const candidates = await prisma.user.findMany({
    where: {
      AND: [
        { role: 'postulante' },
        { email: { not: session.user.email } },
        { profile: { isNot: null } }
      ]
    },
    include: { 
      profile: true,
      asCandidate: {
        where: { recruiterId: currentUser.id }
      }
    },
  })

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Candidatos</h1>
      {candidates.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No hay candidatos registrados aún.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {candidates.map((candidate) => (
            <Card key={candidate.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-800 dark:text-white">{candidate.name || candidate.username}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 dark:text-gray-300 break-words">
                <p>Email: {candidate.email}</p>
                <p>Carrera: {candidate.profile?.career || 'No especificado'}</p>
                <p>Experiencia: {candidate.profile?.experience || 'No especificado'}</p>
                <Link href={`/candidate/${candidate.id}`}>
                  <Button className="mt-2">Ver detalles</Button>
                </Link>
                {candidate.asCandidate.length > 0 && (
                  <p className="mt-2 text-green-600 font-semibold">Marcado como interesante</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

