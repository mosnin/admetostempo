'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, X, Loader2 } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'

interface AvatarUploadProps {
  currentUrl?: string | null
  name: string
  onUpload: (url: string) => void
}

export function AvatarUpload({ currentUrl, name, onUpload }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) { setError('Please select an image file'); return }
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB'); return }

    setError(null)
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const res = await fetch('/api/profile/avatar', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')
      const { url } = await res.json()
      onUpload(url)
    } catch (e) {
      setError('Upload failed. Please try again.')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        <Avatar
          src={preview || currentUrl || undefined}
          name={name}
          size="2xl"
          className="ring-4 ring-white shadow-xl"
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <Camera className="text-white w-8 h-8" />
        </button>
        {uploading && (
          <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
            <Loader2 className="text-white w-8 h-8 animate-spin" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-800 font-medium transition-colors"
      >
        <Upload size={14} /> Change photo
      </button>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  )
}
