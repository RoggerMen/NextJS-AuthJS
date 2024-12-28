import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { revalidatePath } from "next/cache"

export default async function CandidateDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.email) {
    redirect('/login')
  }

  const recruiter = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!recruiter || recruiter.role !== 'reclutador') {
    redirect('/')
  }

  const candidate = await prisma.user.findUnique({
    where: { id: parseInt(params.id,10) },
    include: { 
      profile: true,
      asCandidate: {
        where: { recruiterId: recruiter.id }
      }
    },
  })

  if (!candidate) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="text-gray-600 dark:text-gray-300 p-4">
            <p>Candidato no encontrado</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isInterested = candidate.asCandidate.length > 0

  const handleInterest = async () => {
    'use server'
    if (isInterested) {
      await prisma.candidate.deleteMany({
        where: { 
          userId: candidate.id,
          recruiterId: recruiter.id,
        },
      })
    } else {
      await prisma.candidate.create({
        data: {
          userId: candidate.id,
          recruiterId: recruiter.id,
        },
      })
    }
    revalidatePath(`/candidate/${params.id}`)
  }

  const sendInterviewInvitation = async () => {
    'use server'
    // Aquí iría la lógica para enviar la invitación de entrevista
    console.log(`Enviando invitación de entrevista a ${candidate.email}`)
    // Implementa la lógica real de envío de invitación aquí
  }

  const sendTestInvitation = async () => {
    'use server'
    // Aquí iría la lógica para enviar la invitación al test de código
    console.log(`Enviando invitación al test de código a ${candidate.email}`)
    // Implementa la lógica real de envío de invitación al test aquí
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-white">{candidate.name}</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-600 dark:text-gray-300">
          <p>Email: {candidate.email}</p>
          <p>Teléfono: {candidate.phoneNumber || 'No especificado'}</p>
          <p>Carrera: {candidate.profile?.career || 'No especificado'}</p>
          <p>Educación: {candidate.profile?.education || 'No especificado'}</p>
          <p>Nivel de inglés: {candidate.profile?.englishLevel || 'No especificado'}</p>
          <p>Salario deseado: {candidate.profile?.salary || 'No especificado'}</p>
          <p>Experiencia: {candidate.profile?.experience || 'No especificado'}</p>
          <p>LinkedIn: {candidate.profile?.linkedin || 'No especificado'}</p>
          {candidate.profile?.cvUrl && (
            <a href={candidate.profile.cvUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Ver CV
            </a>
          )}
          <form action={handleInterest} className="mt-4">
            <Button type="submit">
              {isInterested ? 'Quitar de interesantes' : 'Marcar como interesante'}
            </Button>
          </form>
          <form action={sendInterviewInvitation} className="mt-2">
            <Button type="submit">Enviar invitación de entrevista</Button>
          </form>
          <form action={sendTestInvitation} className="mt-2">
            <Button type="submit">Enviar test de código</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

