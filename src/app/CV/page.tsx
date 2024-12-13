import CVUpload from "../(auth)/_components/Interface/CVUpload/CVUpload";

export default function CVPage() {
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Subir CV/Hoja de vida</h1>
      <CVUpload />
    </div>
  )
}

