import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import HandleSignOutComponent from "@/app/(auth)/_components/Interface/UI/handleSignOutComponent"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UsersTable } from "@/app/(auth)/_components/UsersTable/UsersTable"
 

export default async function AdminPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }
  if (session?.user?.role !== "admin") {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Acceso Denegado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">No tienes permitido ver esta página - No eres Administrador</p>
          <HandleSignOutComponent>Volver a Iniciar Sesión</HandleSignOutComponent>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Panel de Administración</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Bienvenido, {session.user?.name} al Admin de Tenmás</p>
          <Link href="/">
            <Button>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios Registrados (No Administradores)</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable />
        </CardContent>
      </Card>
    </div>
  )
}

