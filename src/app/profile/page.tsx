import ProfileForm from '../(auth)/_components/Interface/ProfileForm/ProfileForm'
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.email) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true },
  })

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Perfil</h1>
      <ProfileForm initialData={
    user?.profile
      ? {
          career: user.profile.career || "",
          education: user.profile.education || "",
          englishLevel: user.profile.englishLevel || "",
          salary: user.profile.salary || "",
          experience: user.profile.experience || "",
          linkedin: user.profile.linkedin || "",
        }
      : {}} />
    </div>
  )
}

