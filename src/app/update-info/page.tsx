"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios, { AxiosError } from 'axios'
import { toast } from 'react-hot-toast'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Eye, EyeOff } from 'lucide-react'

const baseSchema = z.object({
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(5, "Password must be at least 5 characters"),
  confirmNewPassword: z.string().min(5, "Password must be at least 5 characters"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
});

const schema = baseSchema.extend({
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmNewPassword: z.string().optional(),
}).refine((data) => {
  // Si algún campo de contraseña está lleno, todos deben estar llenos
  const passwordFieldsFilled = [data.currentPassword, data.newPassword, data.confirmNewPassword].filter(Boolean).length;
  return passwordFieldsFilled === 0 || passwordFieldsFilled === 3;
}, {
  message: "All password fields must be filled to change password",
  path: ["newPassword"],
}).refine((data) => {
  // Si se están llenando los campos de contraseña, asegúrate de que coincidan
  if (data.newPassword || data.confirmNewPassword) {
    return data.newPassword === data.confirmNewPassword;
  }
  return true;
}, {
  message: "New passwords do not match",
  path: ["confirmNewPassword"],
});

type SettingsFormData = z.infer<typeof schema>

export default function UpdateInfoPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingUserData, setIsLoadingUserData] = useState(true)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const isGoogleUser = session?.provider === 'google'

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      phoneNumber: '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/')
    } else {
      const fetchUserData = async () => {
        setIsLoadingUserData(true)
        try {
          const response = await axios.get('/api/user')
          const userData = response.data
          form.setValue('email', userData.email)
          form.setValue('phoneNumber', userData.phoneNumber || '')
        } catch (error) {
          console.error('Failed to fetch user data:', error)
          if (error instanceof AxiosError) {
            toast.error(`No se pudieron cargar los datos del usuario: ${error.response?.data?.error || error.message}`)
          } else {
            toast.error('Se produjo un error inesperado al cargar los datos del usuario.')
          }
        } finally {
          setIsLoadingUserData(false)
        }
      }

      fetchUserData()
    }
  }, [session, status, router, form])

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true)
    try {
      const updateData: Partial<SettingsFormData> = {
        phoneNumber: data.phoneNumber,
      }

      if (data.currentPassword && data.newPassword && data.confirmNewPassword) {
        if (data.newPassword !== data.confirmNewPassword) {
          toast.error('New passwords do not match');
          setIsLoading(false);
          return;
        }
        updateData.currentPassword = data.currentPassword
        updateData.newPassword = data.newPassword
      }

      await axios.post('/api/update-info', updateData)
      toast.success('Información actualizada exitosamente')
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || 'No se pudo actualizar la información');
      } else {
        toast.error('Ocurrió un error inesperado');
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || !session) {
    return <div>Loading...</div>
  }

  if (isLoadingUserData) {
    return <div>Loading user data...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Actualizar Información</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white" disabled />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Número de Celular</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {!isGoogleUser && (
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Cambiar Contraseña (Opcional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">Contraseña Actual</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showCurrentPassword ? "text" : "password"} 
                            {...field} 
                            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10" 
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-5 w-5" aria-hidden="true" />
                            ) : (
                              <Eye className="h-5 w-5" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">Contraseña Nueva</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showNewPassword ? "text" : "password"} 
                            {...field} 
                            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10" 
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-5 w-5" aria-hidden="true" />
                            ) : (
                              <Eye className="h-5 w-5" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">Confirmar Contraseña Nueva</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showConfirmPassword ? "text" : "password"} 
                            {...field} 
                            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10" 
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" aria-hidden="true" />
                            ) : (
                              <Eye className="h-5 w-5" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-indigo-900 hover:bg-indigo-950 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {isLoading ? 'Actualizando...' : 'Actualizar Información'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

