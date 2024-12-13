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

const baseSchema = z.object({
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
});

const credentialsSchema = baseSchema.extend({
  currentPassword: z.string().min(5, "Password must be at least 5 characters"),
  newPassword: z.string().min(5, "Password must be at least 5 characters"),
  confirmNewPassword: z.string().min(5, "Password must be at least 5 characters"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
});

type SettingsFormData = z.infer<typeof credentialsSchema>

export default function UpdateInfoPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const isGoogleUser = session?.provider === 'google'

  const schema = isGoogleUser ? baseSchema : credentialsSchema

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
        try {
          const response = await axios.get('/api/user')
          const userData = response.data
          form.setValue('email', userData.email)
          form.setValue('phoneNumber', userData.phoneNumber || '')
        } catch (error) {
          console.error('Failed to fetch user data:', error)
          toast.error('Failed to load user data')
        }
      }

      fetchUserData()
    }
  }, [session, status, router, form])

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true)
    try {
      await axios.post('/api/update-info', data)
      toast.success('Settings updated successfully')
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || 'Failed to update settings');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || !session) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Actualizar perfil</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Información personal</CardTitle>
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
                <CardTitle className="text-gray-900 dark:text-white">Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
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
                      <FormLabel className="text-gray-700 dark:text-gray-300">New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
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
                      <FormLabel className="text-gray-700 dark:text-gray-300">Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
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

