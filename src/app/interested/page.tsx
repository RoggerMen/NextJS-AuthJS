import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function InterestedPage() {
  const session = await auth()
  if (!session?.user?.email) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (user?.role !== 'reclutador') {
    redirect('/')
  }

  const interestedCandidates = await prisma.candidate.findMany({
    where: { recruiterId: user.id },
    include: { 
      user: { 
        include: { 
          profile: true 
        } 
      } 
    },
  })

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Candidatos Interesantes</h1>
      {interestedCandidates.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No has marcado ningún candidato como interesante aún.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interestedCandidates.map((candidate) => (
            <Card key={candidate.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 break-words">
              <CardHeader>
                <CardTitle className="text-gray-800 dark:text-white">{candidate.user.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 dark:text-gray-300">
                <p>Email: {candidate.user.email}</p>
                <p>Carrera: {candidate.user.profile?.career || 'No especificado'}</p>
                <p>Experiencia: {candidate.user.profile?.experience || 'No especificado'}</p>
                <Link href={`/candidate/${candidate.user.id}`}>
                  <Button className="mt-2">Ver detalles</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

