"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/navigation'

const profileSchema = z.object({
  career: z.string().min(1, "Se requiere carrera"),
  education: z.string().min(1, "Se requiere educación"),
  englishLevel: z.string().min(1, "Se requiere nivel de inglés"),
  salary: z.string().min(1, "Se requiere salario deseado"),
  experience: z.string().min(1, "Se requieren años de experiencia"),
  linkedin: z.string().optional().or(z.literal('')),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfileForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      career: "",
      education: "",
      englishLevel: "",
      salary: "",
      experience: "",
      linkedin: "",
    },
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile')
        const profileData = response.data
        Object.keys(profileData).forEach((key) => {
          form.setValue(key as keyof ProfileFormData, profileData[key])
        })
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      }
    }

    fetchProfile()
  }, [form])

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    try {
      await axios.post('/api/profile', data)
      toast.success('Perfil registrado exitosamente')
      router.push("/overview")
    } catch (error) {
      console.error('No se pudo registrar el perfil:', error)
      toast.error('No se pudo registrar el perfil')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-gray-900 dark:text-white">
        <FormField
          control={form.control}
          name="career"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 dark:text-white">Carrera</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Ingeniería de Software" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 dark:text-white">Educación</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Licenciatura en Ciencias de la Computación" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="englishLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 dark:text-white">Nivel de inglés</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el nivel de inglés" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="beginner">Principiante</SelectItem>
                  <SelectItem value="intermediate">Intermedio</SelectItem>
                  <SelectItem value="advanced">Avanzado</SelectItem>
                  <SelectItem value="fluent">Fluido</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 dark:text-white">Salario deseado</FormLabel>
              <FormControl>
                <Input placeholder="Ej: 50000" {...field} />
              </FormControl>
              <FormDescription className="text-gray-500 dark:text-gray-400">Ingrese el salario anual deseado en $</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 dark:text-white">Años de experiencia</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 dark:text-white">Perfil de LinkedIn</FormLabel>
              <FormControl>
                <Input placeholder="https://www.linkedin.com/in/your-profile" {...field} />
              </FormControl>
              <FormDescription className="text-gray-500 dark:text-gray-400">Ingrese la URL completa de su perfil de LinkedIn</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrar perfil'}
        </Button>
      </form>
    </Form>
  )
}

