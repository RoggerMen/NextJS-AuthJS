"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from 'next/navigation'

const profileSchema = z.object({
  career: z.string().min(1, "Se requiere carrera"),
  education: z.string().min(1, "Se requiere educación"),
  englishLevel: z.string().min(1, "Se requiere salario deseado"),
  salary: z.string().min(1, "Se requiere salario deseado"),
  experience: z.string().min(1, "Se requieren años de experiencia."),
  linkedin: z.string().url("URL LinkedIn Inválida").optional().or(z.literal('www.linkedin.com/in/rogger-meneses-24851b264')),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfileForm() {

  const route = useRouter();

  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema)
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile')
        const profileData = response.data
        Object.keys(profileData).forEach((key) => {
          setValue(key as keyof ProfileFormData, profileData[key])
        })
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      }
    }

    fetchProfile()
  }, [setValue])

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    try {
      await axios.post('/api/profile', data)
      toast.success('Perfil registrado exitosamente')
      route.push("/overview")
    } catch (error) {
        console.error('No se pudo registrar el perfil:', error)
      toast.error('No se pudo registrar el perfil')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="career" className="block text-sm font-medium text-gray-700">Carrera</label>
        <Input id="career" {...register('career')} className="mt-1" />
        {errors.career && <p className="mt-1 text-sm text-red-600">{errors.career.message}</p>}
      </div>

      <div>
        <label htmlFor="education" className="block text-sm font-medium text-gray-700">Educación</label>
        <Input id="education" {...register('education')} className="mt-1" />
        {errors.education && <p className="mt-1 text-sm text-red-600">{errors.education.message}</p>}
      </div>

      <div>
        <label htmlFor="englishLevel" className="block text-sm font-medium text-gray-700">Nivel de inglés</label>
        <Select onValueChange={(value) => setValue('englishLevel', value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccione el nivel de inglés" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Principiante</SelectItem>
            <SelectItem value="intermediate">Intermedio</SelectItem>
            <SelectItem value="advanced">Avanzado</SelectItem>
            <SelectItem value="fluent">Fluido</SelectItem>
          </SelectContent>
        </Select>
        {errors.englishLevel && <p className="mt-1 text-sm text-red-600">{errors.englishLevel.message}</p>}
      </div>

      <div>
        <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salario deseado</label>
        <Input id="salary" {...register('salary')} className="mt-1" />
        {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary.message}</p>}
      </div>

      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Años de experiencia</label>
        <Input id="experience" type="number" {...register('experience')} className="mt-1" />
        {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>}
      </div>

      <div>
        <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">Perfil de LinkedIn</label>
        <Input id="linkedin" {...register('linkedin')} className="mt-1" />
        {errors.linkedin && <p className="mt-1 text-sm text-red-600">{errors.linkedin.message}</p>}
      </div>

      <Button className='w-full' type="submit" disabled={isLoading}>
        {isLoading ? 'Registrar...' : 'Registrar perfil'}
      </Button>
    </form>
  )
}

