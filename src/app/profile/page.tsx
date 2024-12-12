import ProfileForm from '../(auth)/_components/Interface/ProfileForm/ProfileForm'

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Perfil</h1>
      <ProfileForm />
    </div>
  )
}

