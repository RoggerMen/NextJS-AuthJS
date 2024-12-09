"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const settingsSchema = z.object({
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  currentPassword: z.string().min(5, "Password must be at least 5 characters"),
  newPassword: z.string().min(5, "Password must be at least 5 characters"),
  confirmNewPassword: z.string().min(5, "Password must be at least 5 characters"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
});

type SettingsFormData = z.infer<typeof settingsSchema>

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema)
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/user')
        const userData = response.data
        setValue('email', userData.email)
        setValue('phoneNumber', userData.phoneNumber || '')
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        toast.error('Failed to load user data')
      }
    }

    fetchUserData()
  }, [setValue])

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true)
    try {
      await axios.post('/api/update-setting', data)
      toast.success('Settings updated successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update settings')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <Input id="email" type="email" {...register('email')} className="mt-1" />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <Input id="phoneNumber" {...register('phoneNumber')} className="mt-1" />
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
              <Input id="currentPassword" type="password" {...register('currentPassword')} className="mt-1" />
              {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>}
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
              <Input id="newPassword" type="password" {...register('newPassword')} className="mt-1" />
              {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>}
            </div>
            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <Input id="confirmNewPassword" type="password" {...register('confirmNewPassword')} className="mt-1" />
              {errors.confirmNewPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmNewPassword.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Actualizando...' : 'Actualizar Perfil'}
        </Button>
      </form>
    </div>
  )
}

