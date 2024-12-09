"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function CVUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentCV, setCurrentCV] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile')
        setCurrentCV(response.data.cvUrl)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      }
    }

    fetchProfile()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file')
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('/api/upload-cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setCurrentCV(response.data.cvUrl)
      toast.success('CV uploaded successfully')
    } catch (error) {
      console.error('Failed to upload CV:', error)
      toast.error('Failed to upload CV')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {currentCV && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Current CV</h3>
            <a href={currentCV} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              View CV
            </a>
          </CardContent>
        </Card>
      )}
      <Input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
      <Button onClick={handleUpload} disabled={!file || isLoading}>
        {isLoading ? 'Uploading...' : 'Upload CV'}
      </Button>
    </div>
  )
}

