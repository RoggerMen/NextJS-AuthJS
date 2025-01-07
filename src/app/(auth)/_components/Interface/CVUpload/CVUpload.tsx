"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from 'next/navigation'

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const cvSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Archivo CV es requerido.")
    .refine((files) => files[0]?.size <= MAX_FILE_SIZE, `El tamaño máximo del archivo CV es 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files[0]?.type),
      "Solo estos archivos son aceptados .pdf, .doc, and .docx."
    ),
})

type CVFormData = z.infer<typeof cvSchema>

export default function CVUpload() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentCV, setCurrentCV] = useState<string | null>(null)

  const form = useForm<CVFormData>({
    resolver: zodResolver(cvSchema),
  })

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile')
        setCurrentCV(response.data.cvUrl)
      } catch (error) {
        console.error('Fallo al buscar perfil', error)
      }
    }

    fetchProfile()
  }, [])

  const onSubmit = async (data: CVFormData) => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append('file', data.file[0])

    try {
      const response = await axios.post('/api/upload-cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setCurrentCV(response.data.cvUrl)
      toast.success('El CV cargo Satisfactoriamente')
      router.refresh()
    } catch (error) {
      console.error('Falló al cargar el CV:', error)
      toast.error('Falló al cargar el CV')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {currentCV && (
        <Card>
          <CardHeader>
            <CardTitle>CV actual</CardTitle>
          </CardHeader>
          <CardContent>
          <iframe src={currentCV} width="100%" height="600px" />
            <a href={currentCV} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Ver CV
            </a>
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 dark:text-white">
          <FormField
            control={form.control}
            name="file"
            render={({ field: { onChange, ...rest } }) => (
              <FormItem>
                <FormLabel>Subir CV</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => onChange(e.target.files)}
                    {...rest}
                    value={undefined}
                  />
                </FormControl>
                <FormDescription className='text-black-200 dark:text-slate-200'>
                Sube tu CV en formato PDF, DOC o DOCX. Tamaño máximo del archivo: 5 MB.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600">
            {isLoading ? 'Subiendo CV...' : 'Subir CV'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

